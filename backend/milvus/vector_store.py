from pymilvus import connections, utility
from pymilvus import Collection, CollectionSchema, FieldSchema, DataType

MILVUS_HOST = "milvus"
MILVUS_PORT = "19530"

# --- Collection Names ---
VIDEO_SEGMENT_COLLECTION = "video_segments"
FRAME_COLLECTION = "frames"
REID_COLLECTION = "reid_objects" # New collection for ReID
TAG_COLLECTION = "tags" # Kept for future use

def create_milvus_collections():
    """
    Creates the necessary collections in Milvus if they don't already exist.
    """
    try:
        connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
        print("Successfully connected to Milvus.")

        # --- Video Segment Collection (for text-to-video search) ---
        if not utility.has_collection(VIDEO_SEGMENT_COLLECTION):
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=False),
                FieldSchema(name="video_id", dtype=DataType.INT64),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=512) # Correct dim for clip4clip
            ]
            schema = CollectionSchema(fields, description="Video segment embeddings for text-to-video search")
            collection = Collection(VIDEO_SEGMENT_COLLECTION, schema)

            index_params = {"metric_type": "L2", "index_type": "IVF_FLAT", "params": {"nlist": 1024}}
            collection.create_index(field_name="embedding", index_params=index_params)
            print(f"Collection '{VIDEO_SEGMENT_COLLECTION}' created.")

        # --- Frame Collection ---
        if not utility.has_collection(FRAME_COLLECTION):
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=False),
                FieldSchema(name="video_id", dtype=DataType.INT64),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768) # Dim for vit_base_patch16_224
            ]
            schema = CollectionSchema(fields, description="Frame embeddings for image similarity")
            collection = Collection(FRAME_COLLECTION, schema)

            index_params = {"metric_type": "L2", "index_type": "IVF_FLAT", "params": {"nlist": 1024}}
            collection.create_index(field_name="embedding", index_params=index_params)
            print(f"Collection '{FRAME_COLLECTION}' created.")

        # --- ReID Object Collection ---
        if not utility.has_collection(REID_COLLECTION):
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=False),
                FieldSchema(name="object_id", dtype=DataType.INT64), # Corresponds to RecognizedObject ID in PostgreSQL
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=2048) # Typical ReID model dimension
            ]
            schema = CollectionSchema(fields, description="Re-identification embeddings for tracking objects")
            collection = Collection(REID_COLLECTION, schema)

            index_params = {"metric_type": "L2", "index_type": "IVF_FLAT", "params": {"nlist": 1024}}
            collection.create_index(field_name="embedding", index_params=index_params)
            print(f"Collection '{REID_COLLECTION}' created.")

    except Exception as e:
        print(f"An error occurred while setting up Milvus: {e}")
    finally:
        if utility.has_connection("default"):
            connections.disconnect("default")
            print("Disconnected from Milvus.")

if __name__ == "__main__":
    create_milvus_collections()
