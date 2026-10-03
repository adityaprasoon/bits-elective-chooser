window.APP_CONFIG = {
  program: {
    title: "M.Tech AIML (Semester 2) Elective Chooser - Unofficial App",
    subtitle: "Explore elective options and plan your specialization for M.Tech AIML Semester 2.",
    requiredElectivesCount: 2
  },
  mandatoryCourses: [
    { code: "DRL", title: "Deep Reinforcement Learning", units: 4 },
    { code: "ACI", title: "Artificial Computational Intelligence", units: 4 }
  ],
  specializations: [
    { id: "nlp", name: "NLP", fullName: "Natural Language Processing", mandatoryCourseCodes: ["AIMLCZG530"] },
    { id: "audio_vision", name: "Audio & Vision", fullName: "Audio and Vision", mandatoryCourseCodes: ["AIMLCZG525"] },
    { id: "deep_learning", name: "Deep Learning", mandatoryCourseCodes: ["AIMLCZG533"] }
  ],
  buckets: [
    {
      id: "bucket_1",
      name: "Bucket 1",
      courses: [
        { code: "AIMLCZG530", title: "Natural Language Processing", units: 4 }
      ]
    },
    {
      id: "bucket_2",
      name: "Bucket 2",
      courses: [
        { code: "AIMLCZG567", title: "AI and ML Techniques for Cyber Security", units: 5 },
        { code: "AIMLCZG525", title: "Computer Vision", units: 4 },
        { code: "AIMLCZG509", title: "Architecting AI systems", units: 4 }
      ]
    },
    {
      id: "bucket_3",
      name: "Bucket 3",
      courses: [
        { code: "AIMLCZG516", title: "ML System optimization", units: 4 },
        { code: "AIMLCZG526", title: "Probabilistic Graphical Models", units: 4 },
        { code: "AIMLCZG540", title: "Video Analysis", units: 4 }
      ]
    },
    {
      id: "bucket_4",
      name: "Bucket 4",
      courses: [
        { code: "AIMLCZG537", title: "Information Retrieval", units: 4 },
        { code: "AIMLCZG529", title: "Data Management for Machine Learning", units: 4 },
        { code: "AIMLCZG543", title: "Multimodal Information Retrieval", units: 4 },
        { code: "AIMLCZG533", title: "Unsupervised Deep Learning", units: 4 }
      ]
    }
  ]
};
