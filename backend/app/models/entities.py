from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    auth_provider: Mapped[str | None] = mapped_column(String(32), nullable=True)


class UserIdentity(Base):
    __tablename__ = "user_identities"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(32), index=True)
    provider_user_id: Mapped[str] = mapped_column(String(255), index=True)
    access_meta: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True)
    openalex_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(512), index=True)
    issn: Mapped[str | None] = mapped_column(String(32), nullable=True)
    publisher: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_oa: Mapped[bool] = mapped_column(Boolean, default=False)


class Paper(TimestampMixin, Base):
    __tablename__ = "papers"

    id: Mapped[int] = mapped_column(primary_key=True)
    openalex_id: Mapped[str | None] = mapped_column(String(64), unique=True, index=True)
    doi: Mapped[str | None] = mapped_column(String(255), index=True)
    title: Mapped[str] = mapped_column(Text, index=True)
    abstract: Mapped[str | None] = mapped_column(Text, nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, index=True)
    venue_id: Mapped[int | None] = mapped_column(ForeignKey("venues.id"), nullable=True)
    language: Mapped[str | None] = mapped_column(String(16), nullable=True)
    is_oa: Mapped[bool] = mapped_column(Boolean, default=False)
    cited_by_count: Mapped[int] = mapped_column(Integer, default=0)


class PaperSource(Base):
    __tablename__ = "paper_sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    source_name: Mapped[str] = mapped_column(String(64), index=True)
    source_record_id: Mapped[str] = mapped_column(String(128), index=True)
    raw_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PaperLink(Base):
    __tablename__ = "paper_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    link_type: Mapped[str] = mapped_column(String(32), index=True)
    url: Mapped[str] = mapped_column(Text)
    is_best: Mapped[bool] = mapped_column(Boolean, default=False)
    license: Mapped[str | None] = mapped_column(String(128), nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    openalex_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    orcid: Mapped[str | None] = mapped_column(String(64), nullable=True)
    h_index: Mapped[int | None] = mapped_column(Integer, nullable=True)
    works_count: Mapped[int | None] = mapped_column(Integer, nullable=True)


class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[int] = mapped_column(primary_key=True)
    openalex_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    country_code: Mapped[str | None] = mapped_column(String(8), nullable=True)
    type: Mapped[str | None] = mapped_column(String(64), nullable=True)


class PaperAuthor(Base):
    __tablename__ = "paper_authors"

    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True)
    position: Mapped[int | None] = mapped_column(Integer, nullable=True)
    institution_id: Mapped[int | None] = mapped_column(ForeignKey("institutions.id"), nullable=True)


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[int] = mapped_column(primary_key=True)
    openalex_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    level: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class PaperConcept(Base):
    __tablename__ = "paper_concepts"

    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id", ondelete="CASCADE"), primary_key=True)
    score: Mapped[float] = mapped_column(Float, default=0.0)


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class PaperTopic(Base):
    __tablename__ = "paper_topics"

    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), primary_key=True)
    score: Mapped[float] = mapped_column(Float, default=0.0)


class Citation(Base):
    __tablename__ = "citations"

    citing_paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    cited_paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    context_text: Mapped[str | None] = mapped_column(Text, nullable=True)


class Embedding(Base):
    __tablename__ = "embeddings"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(64), index=True)
    entity_id: Mapped[int] = mapped_column(Integer, index=True)
    model_name: Mapped[str] = mapped_column(String(64), index=True)
    vector: Mapped[list[float]] = mapped_column(Vector(768))
    text_hash: Mapped[str] = mapped_column(String(128), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserEvent(Base):
    __tablename__ = "user_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    event_type: Mapped[str] = mapped_column(String(64), index=True)
    paper_id: Mapped[int | None] = mapped_column(ForeignKey("papers.id"), nullable=True)
    topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.id"), nullable=True)
    payload_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    interest_vector: Mapped[list[float] | None] = mapped_column(Vector(768), nullable=True)
    exploration_score: Mapped[float] = mapped_column(Float, default=0.2)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    feed_type: Mapped[str] = mapped_column(String(64), index=True)
    score: Mapped[float] = mapped_column(Float)
    reason_code: Mapped[str] = mapped_column(String(64), index=True)
    reason_text: Mapped[str] = mapped_column(Text)
    served_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class Bookmark(Base):
    __tablename__ = "bookmarks"
    __table_args__ = (UniqueConstraint("user_id", "paper_id", name="uq_bookmark_user_paper"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Collection(Base):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CollectionItem(Base):
    __tablename__ = "collection_items"

    collection_id: Mapped[int] = mapped_column(ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    selection_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(64), index=True)


class PaperTag(Base):
    __tablename__ = "paper_tags"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)


class SavedSearch(Base):
    __tablename__ = "saved_searches"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    query_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
