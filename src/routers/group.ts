import * as express from "express";
import { Group } from "../models/group";

export const groupRouter = express.Router();

groupRouter.get("/", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      return res.send(group);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.post("/", async (req, res) => {
  const group = new Group(req.body);

  try {
    await group.save();
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.patch("/", async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: "A group name must be provided",
    });
  }

  const allowedUpdates = [
    "name",
    "members",
    "groupStats",
    "favoriteTracks",
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
    const group = await Group.findOneAndUpdate(
      {
        name: req.query.name.toString(),
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.patch("/:id", async (req, res) => {
  const allowedUpdates = [
    "name",
    "members",
    "groupStats",
    "favoriteTracks",
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
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.delete("/", async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: "A group name must be provided",
    });
  }

  try {
    const group = await Group.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!group) {
      return res.status(404).send();
    } else {
      return res.send(group);
    }
  } catch (error) {
    res.status(400).send();
  }  
});

groupRouter.delete("/:id", async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).send();
    } else {
      return res.send(group);
    }
  } catch (error) {
    res.status(400).send();
  }
});