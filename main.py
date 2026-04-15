from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from dotenv import load_dotenv
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from typing import Optional

load_dotenv()



llm = HuggingFaceEndpoint(
    repo_id="openai/gpt-oss-120b",
    task="text-generation"
)

model = ChatHuggingFace(llm = llm)

class Description(BaseModel):
    title: str = Field(description="Name of the product")

    tagline: str = Field(
        description="A short catchy one-line phrase describing the product"
    )

    description: str = Field(
        description="A detailed marketing-style description of the product highlighting its benefits and quality"
    )

    features: list[str] = Field(
        description="Key features or highlights of the product in bullet points"
    )


parser = PydanticOutputParser(pydantic_object=Description)


prompt = PromptTemplate(
    template="""
    You are an expert e-commerce copywriter.

    Generate a structured product description based on the given information.

    Caption: {caption}

    Style: {style}
    Tone: {tone}
    Description Length: {length}

    Instructions:
    - Make the description engaging and marketing-oriented.
    - Ensure the tone and style are followed strictly.
    - Keep the length as specified (short, medium, or long).
    - Be creative but realistic.

    {format_instructions}
    """,
    input_variables=["caption", "style", "tone", "length"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

final_chain = prompt | model | parser

def generate_description(caption, style, tone, length):
    for i in range(3):
        try:
            result = final_chain.invoke({
                "caption": caption,
                "style": style,
                "tone": tone,
                "length": length
            })
            print(type(result))
            return result.model_dump()
        except Exception as e:
            print("Retrying due to error:", e)

    return {
    "title": "",
    "tagline": "",
    "description": "Failed to generate description",
    "features": []
}