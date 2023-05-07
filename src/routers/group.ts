import * as express from "express";
import { Group } from "../models/group";
import { User } from "../models/user"

export const groupRouter = express.Router();
/**
 * Update the group stats according to the individual users stats
 * @param group Group whose stats are going to be update
 * @param res Response to the express server
 * @returns void
 */
export async function updateStats(group, res) {
  let kmsWeekly = 0;
  let unevennessWeekly = 0;
  let kmsMonthly = 0;
  let unevennessMonthly = 0;
  let kmsYearly = 0;
  let unevennessYearly = 0;

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    if (!user) {
      return res.status(404).send();
    }
    kmsWeekly += user.trainingStats.weekly.length;
    unevennessWeekly += user.trainingStats.weekly.unevenness;
    kmsMonthly += user.trainingStats.monthly.length;
    unevennessMonthly += user.trainingStats.monthly.unevenness;
    kmsYearly += user.trainingStats.yearly.length;
    unevennessYearly += user.trainingStats.yearly.unevenness;
  }
  group.groupStats.weekly.length = kmsWeekly;
  group.groupStats.weekly.unevenness = unevennessWeekly
  group.groupStats.monthly.length = kmsMonthly;
  group.groupStats.monthly.unevenness = unevennessMonthly
  group.groupStats.yearly.length = kmsYearly;
  group.groupStats.yearly.unevenness = unevennessYearly
  await group.save();
}

groupRouter.get('/', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

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

groupRouter.get('/:id', async (req, res) => {
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

groupRouter.post('/', async (req, res) => {
  const group = new Group(req.body);

  try {
    await updateStats(group, res);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A group name must be provided',
    });
  }

  const allowedUpdates = ['name', 'members', 'groupStats', 'favoriteTracks', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const group = await Group.findOneAndUpdate({
      name: req.query.name.toString(),
    },
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (group) {
      await updateStats(group, res);
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['name', 'members', 'groupStats', 'favoriteTracks', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const group = await Group.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (group) {
      await updateStats(group, res)
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A group name must be provided',
    });
  }
  try {
    const group = await Group.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!group) {
      return res.status(404).send();
    } else {
      res.send(group);
    }
  } catch (error) {
    res.status(500).send(error);
  }  
});

groupRouter.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).send();
    } else {
      res.send(group);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});