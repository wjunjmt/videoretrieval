import towhee

class ModelLoader:
    _instance = None
    _text_video_pipeline = None
    _image_embedding_pipeline = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance

    def _load_models(self):
        print("Loading AI models...")
        self._text_video_pipeline = towhee.pipelines.get_pipeline('text_video_retrieval')
        self._image_embedding_pipeline = towhee.pipelines.get_pipeline('image-embedding-timm')
        # Manually set the model name for the image embedding pipeline
        self._image_embedding_pipeline.timm_model.model_name = 'vit_base_patch16_224'
        print("AI models loaded successfully.")

    def get_text_video_pipeline(self):
        return self._text_video_pipeline

    def get_image_embedding_pipeline(self):
        return self._image_embedding_pipeline

# Create a singleton instance
model_loader = ModelLoader()

def get_model_loader():
    return model_loader
