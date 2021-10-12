// Get all meetings
const getAllMeetings = (dB) => async (req, res) => {
  try {
    const meetings = await dB("meetings");
    return res.status(200).json(meetings);
  } catch (err) {
    return res.status(404).json({ message: "Error getting meetings" });
  }
};

// Get meeting
// const getMeetingByUserId = (dB) => async (req, res) => {

// };

// Add meeting
// const addMeetingByUserId = (dB) = (req, res) => {
//   const { id } = req.params;
//   const { event_name, no_of_people, location } = req.body.formInput;
//   console.log(id)

//   if (!event_name || !location || !no_of_people) {
//     return res.json("incomplete form fields");
//   }

//   return dB.insert({
//     event_name: event_name,
//     no_of_people: no_of_people,
//     location: location,
//     user_id: id,
//   })
//     .into("meetings")
//     .returning("*")
//     .then((data) => {
//       return res.status(200).json(data);
//     })
//     .catch((err) => {
//       return res.status(400).json({ message: "Error adding meeting" });
//     });

  // insert meeting data and return all column values of new meeting
  //   try {
  //     return await dB
  //       .insert({
  //         event_name: event_name,
  //         no_of_people: no_of_people,
  //         location: location,
  //         user_id: id,
  //       })
  //       .into("meetings")
  //       .returning("*")
  //       .then((data) => {
  //         return res.status(200).json(data);
  //       });
  //   } catch (err) {
  //     return res.status(400).json({ message: "Error adding meeting" });
  //   }
// };

module.exports = {
  getAllMeetings: getAllMeetings,
  // addMeetingByUserId: addMeetingByUserId,
};
