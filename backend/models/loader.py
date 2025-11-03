import towhee

class ModelLoader:
    _instance = None
    _text_video_pipeline = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance

    def _load_models(self):
        print("Loading AI models...")
        self._text_video_pipeline = towhee.pipelines.get_pipeline('text-video-retrieval')
        print("AI models loaded successfully.")

    def get_text_video_pipeline(self):
        return self._text_video_pipeline

# Create a singleton instance
model_loader = ModelLoader()

def get_model_loader():
    return model_loader
