import * as express from "express";
import { User } from "../models/user";
import { Group } from "../models/group";

export const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};
  try {
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

userRouter.get("/:id", async (req, res) => {
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

userRouter.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch {
    res.status(500).send();
  }
});

userRouter.patch("/", async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: "A user name must be provided",
    });
  }

  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "groups",
    "statistics",
    "favoriteRoutes",
    "activeChallenges",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { name: req.query.name.toString() },
      req.body,
      { new: true, runValidators: true }
    );

    if (user) {
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.patch("/:id", async (req, res) => {
  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "friendsGroups",
    "trainingStats",
    "favoriteRoutes",
    "activeChallenges",
    "trackHistory",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (user) {
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.delete("/", async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: "A user name must be provided",
    });
  }
  try {
    const user = await User.findOneAndDelete({
      name: req.query.name.toString(),
    });
    if (!user) {
      res.status(404).send();
    } else {
    res.send(user);
  } 
      // Cuando se elimina una usuario también lo hace de los grupos a los que pertenezca.
      const userGroup = await Group.find({
        members: user._id,
      });
      
      userGroup.forEach(async (item) => {
        const index = item.members.indexOf(user._id);
  
        if (index > -1) {
          item.members.splice(index, 1);
          await item.save();
        }
      });

    } catch {
    res.status(400).send();
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }

    // Cuando se elimina una usuario también lo hace de los grupos a los que pertenezca.
    const userGroup = await Group.find({
      members: user._id,
    });
    
    userGroup.forEach(async (item) => {
      const index = item.members.indexOf(user._id);

      if (index > -1) {
        item.members.splice(index, 1);
        await item.save();
      }
    });

  } catch {
    res.status(400).send();
  }
});