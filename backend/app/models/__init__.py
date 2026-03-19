# Import all models in dependency order so SQLModel.metadata has every table
# registered before Alembic or the engine inspects it.
#
# Order matters:
#   1. Entities with no FK dependencies first
#   2. RecommendationTag (link table) before Tag and Recommendation
#   3. Recommendation last (depends on all others)

from app.models.host import Host
from app.models.episode import Episode
from app.models.category import Category
from app.models.recommendation_tag import RecommendationTag
from app.models.tag import Tag
from app.models.recommendation import Recommendation

# Re-export for convenient importing elsewhere (e.g. from app.models import Recommendation)
__all__ = [
    "Host",
    "Episode",
    "Category",
    "RecommendationTag",
    "Tag",
    "Recommendation",
]
