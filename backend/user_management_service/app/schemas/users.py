from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    batch_number: int
    batch_size: int