window.APP_CONFIG = {
  program: {
    title: "M.Tech AIML (Semester 2) Elective Chooser — Unofficial Student-Developed Application",
    subtitle: "Select your specialization and electives for the upcoming semester. Space locations and subjects shown are tentative and will be updated after the 3rd October orientation.",
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
        { code: "AIMLCZG546", title: "Software Engineering for Machine Learning", units: 4 }
      ]
    },
    {
      id: "bucket_3",
      name: "Bucket 3",
      courses: [
        { code: "AIMLCZG533", title: "Unsupervised Deep Learning", units: 4 },
        { code: "AIMLCZG526", title: "Probabilistic Graphical Models", units: 4 },
        { code: "AIMLZG540", title: "Video Analysis", units: 4 }
      ]
    },
    {
      id: "bucket_4",
      name: "Bucket 4",
      courses: [
        { code: "AIMLCZG537", title: "Information Retrieval", units: 4 },
        { code: "AIMLCZG529", title: "Data Management for Machine Learning", units: 4 },
        { code: "AIMLCZG515", title: "Distributed Machine Learning", units: 4 }
      ]
    }
  ]
};
