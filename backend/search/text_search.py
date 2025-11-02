import towhee
from pymilvus import Collection, connections, utility
from milvus.vector_store import VIDEO_SEGMENT_COLLECTION, MILVUS_HOST, MILVUS_PORT
from models.loader import get_model_loader

def search_videos_by_text(query: str, top_k=10):
    """
    Embeds a text query using the pre-loaded CLIP text encoder and searches for similar video segments in Milvus.
    """
    model_loader = get_model_loader()

    # 1. Embed the text query using the pre-loaded model
    try:
        pipeline = model_loader.get_text_video_pipeline()
        query_embedding = pipeline.encode_text(query)
    except Exception as e:
        print(f"Error encoding text: {e}")
        return []

    # 2. Search in Milvus
    try:
        connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)
        if not utility.has_collection(VIDEO_SEGMENT_COLLECTION):
            print(f"Collection '{VIDEO_SEGMENT_COLLECTION}' does not exist.")
            return []

        video_segments = Collection(VIDEO_SEGMENT_COLLECTION)
        video_segments.load()

        search_params = {
            "metric_type": "L2",
            "params": {"nprobe": 10},
        }

        results = video_segments.search(
            data=[query_embedding.tolist()],
            anns_field="embedding",
            param=search_params,
            limit=top_k,
            output_fields=['video_id']
        )

        # 3. Process and return results
        if not results:
            return []

        hits = results[0]
        search_results = [{"video_id": hit.entity.get('video_id'), "score": hit.distance} for hit in hits]

        return search_results

    except Exception as e:
        print(f"An error occurred during Milvus search: {e}")
        return []
    finally:
        if utility.has_connection("default"):
            connections.disconnect("default")

if __name__ == '__main__':
    results = search_videos_by_text("a man riding a horse")
    print(results)
