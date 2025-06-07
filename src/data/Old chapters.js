// src/data/chapters.js

export const chapters = {
  correlation: {
    title: "Understanding Correlation",
    sections: [
      {
        id: "A",
        subhead: "Opening Challenge: Why Study Correlation?",
        characters: ["Blake", "Drew", "Professor Hartwell"],
        tensionLevel: "medium",
        learningObjective: "Correlation as tool for prediction, not proof of causation",
        hasCallOnMe: true,
        dialogue: [
          {
            speaker: "Professor Hartwell",
            text: "Blake, you mentioned last week that you keep hearing \"correlation doesn't prove causation\" but wondered why correlation matters at all if it's not causation. Want to start us off?"
          },
          {
            speaker: "Blake", 
            text: "Right. I mean, if correlation doesn't prove anything, why do people get so excited about finding correlations? Seems like—"
          },
          {
            speaker: "Drew",
            text: "*interrupting* Because people's lives depend on predictions, Blake. You can't just dismiss every pattern because it's not perfect causation."
          },
          {
            speaker: "Blake",
            text: "I wasn't dismissing anything. I'm asking why we should care about correlations that might be meaningless."
          },
          {
            speaker: "Professor Hartwell",
            text: "Fair question, Blake. Correlation matters because our task is to try to predict, explain, and change the phenomena we encounter. Correlation means that two phenomena tend to go together. That can help with prediction, but it won't help us explain or change things unless we're correct about causation."
          }
        ]
      },
      {
        id: "B", 
        subhead: "The Smoking Example: When Correlation Suggests Causation",
        characters: ["Professor Hartwell", "Blake", "Casey"],
        tensionLevel: "low",
        learningObjective: "Strong correlation with large samples and persistent patterns",
        hasCallOnMe: false,
        dialogue: [
          {
            speaker: "Professor Hartwell",
            text: "Let's take a concrete example. Smoking and lung cancer. People who smoke have higher rates of lung cancer, and people who smoke more have even higher rates. That's correlation. And in this case, we're pretty confident it's also causation."
          },
          {
            speaker: "Casey",
            text: "But historically, it took decades to establish that causal relationship. The tobacco companies argued for years that it was just correlation."
          },
          {
            speaker: "Blake", 
            text: "See? That's my point. How do we know when we're being fooled?"
          },
          {
            speaker: "Professor Hartwell",
            text: "Excellent question, Blake. Not everyone who smokes gets lung cancer, and not everyone with lung cancer was a smoker. I used to call this the First Iron Law of Social Science: \"Sometimes it's this way and sometimes it's that way.\" Correlation means tendency, not certainty."
          }
        ]
      },
      {
        id: "C",
        subhead: "Three Ways Correlation Misleads", 
        characters: ["Blake", "Avery", "Drew", "Professor Hartwell"],
        tensionLevel: "high",
        learningObjective: "Critical evaluation of correlational evidence",
        hasCallOnMe: true,
        dialogue: [
          {
            speaker: "Avery",
            text: "But the statistical relationship was still meaningful. Large samples, persistent patterns across different populations—"
          },
          {
            speaker: "Blake",
            text: "*cutting in* Statistics can lie, though. Correlation coefficients, confidence intervals... it's all just math designed to make uncertainty look scientific."
          },
          {
            speaker: "Drew",
            text: "*frustrated* So what's your alternative? Just ignore data because it's not perfect?"
          },
          {
            speaker: "Professor Hartwell",
            text: "Blake raises important concerns about how correlations can mislead us. There are three main ways. First, pure coincidence in small samples. Ever hear of the Super Bowl indicator?"
          },
          {
            speaker: "Blake",
            text: "No, what's that?"
          },
          {
            speaker: "Professor Hartwell", 
            text: "In the 1970s and early 80s, investors noticed that when the Super Bowl winner came from the National Football Conference, the stock market went up that year. When the winner came from the American Football Conference, it went down."
          },
          {
            speaker: "Blake",
            text: "*laughing* That's ridiculous."
          }
        ]
      },
      {
        id: "D",
        subhead: "The Personality Psychology Eruption",
        characters: ["Avery", "Blake", "Drew", "Casey"],
        tensionLevel: "very-high", 
        learningObjective: "Complex causation through mediating variables",
        hasCallOnMe: true,
        dialogue: [
          {
            speaker: "Professor Hartwell",
            text: "Third possibility: some other factor causes both. Auto insurance companies found that drivers with good credit ratings have fewer accidents. It's not that good driving creates good credit, or good credit creates good driving."
          },
          {
            speaker: "Avery",
            text: "*getting excited* Oh, I see the system here! The same personality traits—conscientiousness, attention to detail, following through on commitments—those traits cause both good driving AND good credit. It's like both outcomes emerge from the same underlying—"
          },
          {
            speaker: "Blake",
            text: "*interrupting* That personality psychology stuff is baloney."
          },
          {
            speaker: "Drew", 
            text: "*sharply* Well, that says something about YOUR personality."
          },
          {
            speaker: "Casey",
            text: "*trying to mediate* The underlying point about confounding variables is important, regardless of what we think about personality theory."
          }
        ]
      },
      {
        id: "E",
        subhead: "The Causation Challenge: Why Experiments Are Hard",
        characters: ["Professor Hartwell", "Blake", "Drew", "Avery"],
        tensionLevel: "medium",
        learningObjective: "Limitations and possibilities of causal inference", 
        hasCallOnMe: false,
        dialogue: [
          {
            speaker: "Professor Hartwell",
            text: "Personality psychology might be a good topic to discuss next. But Blake, you've identified the core challenge: proving causation is tricky. You have to rule out these third factors. Ideally you'd do a controlled experiment—randomly assign people to smoke or not smoke for decades and see what happens."
          },
          {
            speaker: "Blake",
            text: "Obviously a terrible idea."
          },
          {
            speaker: "Drew",
            text: "Right, so we work with what we have. Observational studies, natural experiments, longitudinal data—"
          },
          {
            speaker: "Avery",
            text: "Plus replication across different contexts. If you see the same correlation in different populations using different methods—"
          },
          {
            speaker: "Blake",
            text: "*skeptically* You still don't have causation. You just have more correlations."
          }
        ]
      },
      {
        id: "F", 
        subhead: "Social Applications: Trust and Pattern Recognition",
        characters: ["Blake", "Drew", "Avery", "Casey", "Professor Hartwell"],
        tensionLevel: "medium",
        learningObjective: "Correlation thinking embedded in human interdependence",
        hasCallOnMe: true,
        dialogue: [
          {
            speaker: "Professor Hartwell",
            text: "Blake raises crucial concerns about premature certainty. But Avery's insight is important too—correlation thinking is embedded in human interdependence itself. Trust, reputation, social learning—they all depend on pattern recognition and causal inference. When you're trying to decide whether to trust someone, Blake, what do you pay attention to?"
          },
          {
            speaker: "Blake",
            text: "How they've acted before, I guess. Whether they keep promises."
          },
          {
            speaker: "Drew",
            text: "Right. You're looking for correlations between past and future behavior."
          },
          {
            speaker: "Avery", 
            text: "And that's exactly what social institutions do at scale. They create systems for tracking behavioral patterns and making predictions about reliability."
          },
          {
            speaker: "Casey",
            text: "Though the question remains how to distinguish meaningful patterns from noise, especially in complex social systems."
          }
        ]
      }
    ],
    navigation: {
      previous: null,
      next: ["social-learning", "trust-systems", "dunbar-number"]
    }
  },

  evolutionaryPsychology: {
    title: "Evolutionary Psychology: Warriors & Worriers",
    conversation: [
      // ... existing content would be here
    ]
  },

  culturalLearning: {
    title: "Cultural Learning: The Secret of Human Success", 
    conversation: [
      // ... existing content would be here
    ]
  }
};

export default chapters;