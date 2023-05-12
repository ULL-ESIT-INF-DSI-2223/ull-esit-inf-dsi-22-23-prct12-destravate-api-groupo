import * as express from "express";
import { Group } from "../models/group";
import { User } from "../models/user"
import { Track } from "../models/track";

export const groupRouter = express.Router();

/**
 * Update the group stats according to the individual users stats
 * @param group Group whose stats are going to be update
 * @param res Response to the express server
 * @returns void
 */
export async function updateStats(group) {
  let kmsWeekly = 0;
  let unevennessWeekly = 0;
  let kmsMonthly = 0;
  let unevennessMonthly = 0;
  let kmsYearly = 0;
  let unevennessYearly = 0;

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    if (!user) {
      throw new Error("Any user is not found")
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

/**
 * Sort the users that conform a group according to the kms and unevenness
 * @param group The group which members will be sorted
 */
export async function ranking(group) {  
  interface userValue {
    id: string;
    number: number
  }

  const rankByKms: userValue[] = [];
  const rankByUnevenness: userValue[] = [];

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    if (!user) {
      throw new Error("Any user is not found")
    }
    let kmsWeekly = 0;
    let unevennessWeekly = 0;
    let kmsMonthly = 0;
    let unevennessMonthly = 0;
    let kmsYearly = 0;
    let unevennessYearly = 0;
    kmsWeekly += user.trainingStats.weekly.length;
    unevennessWeekly += user.trainingStats.weekly.unevenness;
    kmsMonthly += user.trainingStats.monthly.length;
    unevennessMonthly += user.trainingStats.monthly.unevenness;
    kmsYearly += user.trainingStats.yearly.length;
    unevennessYearly += user.trainingStats.yearly.unevenness;

    const userKms = {id: user.id , number: kmsWeekly + kmsMonthly + kmsYearly}
    const userUnevenness = {id: user.id, number: unevennessWeekly + unevennessMonthly + unevennessYearly}

    rankByKms.push(userKms);
    rankByUnevenness.push(userUnevenness);
  }

  group.ranking.byLenght = rankByKms.sort((a, b) => b.number - a.number).map(item => item.id);
  group.ranking.byUnevenness = rankByUnevenness.sort((a, b) => b.number - a.number).map(item => item.id);

  await group.save()
}

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a group, in this case the tracks and the users.
 * @param group Group which tracks and users will be checked
 */
export async function checkItemsExists(group) {
  // Comprobar que los usuarios participantes del grupo existen en la base de datos.
  for (let i = 0; i < group.members.length; i++) {
    const checkUser = await User.findById(group.members[i]);
    if (!checkUser) {
      throw new Error("Any member is not in the database")      
    }
  }

  // Comprobar que las rutas favoritas del usuario existen en la base de datos.
  for (let i = 0; i < group.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(group.favoriteTracks[i]);
    if (!checkTrack) {
      throw new Error("Any track in favoriteTracks is not in the database")           
    }
  }
}

/**
 * Get all the groups in the database or only one if the query string name exists
 */
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

/**
 * Get a specify group according to its ID
 */
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

/**
 * Create a group in the database
 */
groupRouter.post('/', async (req, res) => {
  const group = new Group(req.body);

  try {
    await checkItemsExists(group);
    await updateStats(group);
    await ranking(group);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a group in the database using its name as query string
 */
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
      await checkItemsExists(group);
      await updateStats(group);
      await ranking(group);
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a group in the database using its ID
 */
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
      await checkItemsExists(group);
      await updateStats(group);
      await ranking(group);
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a group in the database using its name as query string
 */
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

/**
 * Delete a group in the database using its ID
 */
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