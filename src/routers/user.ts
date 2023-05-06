import * as express from "express";
import { Document, connect, model, Schema } from "mongoose";

const router = express.Router();

connect("mongodb://127.0.0.1:27017/destravate-app")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Something went wrong when conecting to the database");
  });

interface UserDocumentInterface extends Document {
  id: string;
  name: string;
  activity: "bike" | "running";
  friends: string[];
  friendGroups: {
    name: string;
    friends: string[];
  }[];
  trainingStats: {
    weekly: {
      length: number;
      unevenness: number;
    };
    monthly: {
      length: number;
      unevenness: number;
    };
    yearly: {
      length: number;
      unevenness: number;
    };
  };
  favoriteTracks: string[];
  activeChallenges: string[];
  trackHistory: {
    trackId: string;
    date: Date;
  };
}

const UserSchema = new Schema<UserDocumentInterface>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  activity: [
    {
      type: String,
      required: true,
      enum: ["run", "bike"],
    },
  ],
  friends: [
    {
      type: String,
      required: true,
    },
  ],
  friendGroups: [
    {
      name: {
        type: String,
        required: true,
      },
      friends: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  trainingStats: {
    weekly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    monthly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    yearly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
  },
  favoriteTracks: [
    {
      type: String,
      required: true,
    },
  ],
  activeChallenges: [
    {
      type: String,
      required: true,
    },
  ],
  trackHistory: [
    {
      routeId: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const User = model<UserDocumentInterface>("User", UserSchema);

router.get("/", async (req, res) => {
  try {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};
    const users = await User.find(filter);
    if (users.length !== 0) {
      res.send(users);
    } else {
      res.status(404).send();
    }
  } catch {
    res.status(500).send();
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  } catch {
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch {
    res.status(500).send();
  }
});

router.delete("/", async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: "A name must be provided",
    });
  } else {
    try {
      const user = await User.findOneAndDelete({
        name: req.query.name.toString(),
      });
      if (!user) {
        res.status(404).send();
      } else {
        res.send(user);
      }
    } catch {
      res.status(400).send();
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch {
    res.status(400).send();
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "activities",
      "friends",
      "groups",
      "statistics",
      "favoriteRoutes",
      "activeChallenges",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
