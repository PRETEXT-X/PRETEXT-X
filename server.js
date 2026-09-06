const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// SCENARIOS
// ===============================

const scenarios = [
  {
    id: 1,
    title: "Fake IT Support",
    icon: "🖥️",
    difficulty: "Medium",
    description:
      "Someone contacts an employee claiming to be from the organization's IT support team.",
    story:
      "You receive a message from someone claiming that your computer has a security problem. They ask you to verify some information before they can help.",
    choices: [
      {
        text: "Share the requested information immediately",
        safe: false,
        feedback:
          "Risky choice. An attacker may be using a fake IT-support identity to obtain sensitive information."
      },
      {
        text: "Verify the person's identity through an official IT channel",
        safe: true,
        feedback:
          "Good choice! Always verify unexpected requests through a trusted communication channel."
      },
      {
        text: "Ignore all IT messages forever",
        safe: false,
        feedback:
          "Not ideal. You should verify suspicious requests rather than ignoring every legitimate IT message."
      }
    ]
  },

  {
    id: 2,
    title: "Fake Bank Employee",
    icon: "🏦",
    difficulty: "High",
    description:
      "A caller pretends to be a bank employee and creates urgency.",
    story:
      "A caller says there is suspicious activity on your account and asks you to confirm personal information immediately.",
    choices: [
      {
        text: "Give the caller all requested information",
        safe: false,
        feedback:
          "Dangerous. Never share sensitive information with an unverified caller."
      },
      {
        text: "End the call and contact the bank using its official number",
        safe: true,
        feedback:
          "Excellent! Independently contacting the organization helps verify whether the request is genuine."
      },
      {
        text: "Ask the caller to send another message",
        safe: false,
        feedback:
          "This does not verify the caller. Use an official channel that you find independently."
      }
    ]
  },

  {
    id: 3,
    title: "Fake Job Recruiter",
    icon: "💼",
    difficulty: "Medium",
    description:
      "An attacker pretends to be a recruiter offering an attractive job opportunity.",
    story:
      "You receive a message claiming to be from a recruiter. They ask you to provide information through an unfamiliar link.",
    choices: [
      {
        text: "Click the link and submit the requested information",
        safe: false,
        feedback:
          "Risky. Unexpected links and requests for information should be verified first."
      },
      {
        text: "Verify the recruiter and company using official sources",
        safe: true,
        feedback:
          "Correct! Verify the recruiter, company, and communication channel independently."
      },
      {
        text: "Forward the link to everyone you know",
        safe: false,
        feedback:
          "Unsafe. Do not distribute suspicious links before verifying them."
      }
    ]
  },

  {
    id: 4,
    title: "Fake Friend / Colleague",
    icon: "👤",
    difficulty: "Low",
    description:
      "An attacker pretends to be someone you know and asks for urgent help.",
    story:
      "A person claiming to be your colleague sends an urgent message asking you to share some information.",
    choices: [
      {
        text: "Immediately help because you know the person",
        safe: false,
        feedback:
          "Attackers can impersonate people you know. Urgency should not replace verification."
      },
      {
        text: "Confirm their identity through another trusted channel",
        safe: true,
        feedback:
          "Great decision! Use a separate trusted channel to verify unusual requests."
      },
      {
        text: "Send the information first and ask questions later",
        safe: false,
        feedback:
          "Avoid this. Verify the request before sharing any sensitive information."
      }
    ]
  }
];

// ===============================
// QUIZ
// ===============================

const quizQuestions = [
  {
    id: 1,
    question: "What is pretexting?",
    options: [
      "Creating a believable false story to manipulate a target",
      "Installing antivirus software",
      "Encrypting a hard drive",
      "Updating an operating system"
    ],
    answer: 0
  },

  {
    id: 2,
    question: "Which is a common feature of pretexting attacks?",
    options: [
      "Unusual urgency or pressure",
      "Regular software updates",
      "Strong passwords",
      "Data backups"
    ],
    answer: 0
  },

  {
    id: 3,
    question: "What should you do when someone requests sensitive information unexpectedly?",
    options: [
      "Share it immediately",
      "Verify the request independently",
      "Post it online",
      "Forward it to friends"
    ],
    answer: 1
  },

  {
    id: 4,
    question: "Which technique can help prevent pretexting?",
    options: [
      "Identity verification",
      "Using the same password everywhere",
      "Ignoring security warnings",
      "Sharing OTPs"
    ],
    answer: 0
  },

  {
    id: 5,
    question: "Why do attackers create urgency?",
    options: [
      "To make the target think carefully",
      "To give the target more time",
      "To reduce the target's time for verification",
      "To improve cybersecurity"
    ],
    answer: 2
  },

  {
    id: 6,
    question: "Should you share an OTP with someone claiming to be a bank employee?",
    options: [
      "Yes",
      "Only if they sound professional",
      "Only during emergencies",
      "No"
    ],
    answer: 3
  },

  {
    id: 7,
    question: "What is social engineering?",
    options: [
      "Manipulating people to influence their actions",
      "Designing computer hardware",
      "Writing operating systems",
      "Creating databases"
    ],
    answer: 0
  },

  {
    id: 8,
    question: "What is the safest response to a suspicious request?",
    options: [
      "Act immediately",
      "Verify before taking action",
      "Share partial information",
      "Ignore all security policies"
    ],
    answer: 1
  },

  {
    id: 9,
    question: "Which information should generally be protected?",
    options: [
      "Public website address",
      "Favorite color",
      "Password and OTP",
      "Public company name"
    ],
    answer: 2
  },

  {
    id: 10,
    question: "What is the main goal of PRETEXT-X?",
    options: [
      "Collect real passwords",
      "Teach users how to attack banks",
      "Provide safe pretexting awareness training",
      "Store confidential user information"
    ],
    answer: 2
  }
];

// ===============================
// API
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "PRETEXT-X server is running"
  });
});

app.get("/api/scenarios", (req, res) => {
  res.json(scenarios);
});

app.get("/api/quiz", (req, res) => {
  const safeQuestions = quizQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  res.json(safeQuestions);
});

// ===============================
// QUIZ SCORE
// ===============================

app.post("/api/quiz/score", (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      error: "Invalid answers format"
    });
  }

  let score = 0;

  answers.forEach((userAnswer) => {
    const question = quizQuestions.find(
      (q) => q.id === Number(userAnswer.questionId)
    );

    if (!question) return;

    if (Number(userAnswer.answer) === question.answer) {
      score++;
    }
  });

  const total = quizQuestions.length;
  const percentage = Math.round((score / total) * 100);

  let level;
  let message;

  if (percentage >= 90) {
    level = "Security Defender";
    message =
      "Excellent! You have a strong understanding of pretexting and social engineering risks.";
  } else if (percentage >= 70) {
    level = "Security Aware";
    message =
      "Good job! You understand most common pretexting warning signs.";
  } else if (percentage >= 50) {
    level = "Developing Awareness";
    message =
      "You have basic awareness, but more security training is recommended.";
  } else {
    level = "Needs Improvement";
    message =
      "Review the prevention section and practice identifying suspicious requests.";
  }

  res.json({
    score,
    total,
    percentage,
    level,
    message
  });
});

// ===============================
// FRONTEND
// ===============================

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("       PRETEXT-X SERVER ONLINE");
  console.log("----------------------------------------");
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log("Cybersecurity awareness simulation ready.");
  console.log("----------------------------------------");
});