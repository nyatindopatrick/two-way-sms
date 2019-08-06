const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
const logger = require('morgan')
const Riders = require("./models/Riders.js")
const port = process.env.PORT || 4040;
require('dotenv').config();
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//database connection
// mongoose.connect( 'mongodb+srv://nyatindopatrick:dogobigy97@riders-ecfkm.mongodb.net/test?retryWrites=true&w=majority',
// {useNewUrlParser: true}
// )
// .then(()=>console.log('database connected successfully'))
// .catch(error=>console.log(error));

//  app.post('/riders', (req, res) => {
//     console.log(req.body);
//     const newRider = new Riders(req.body);
//     // if (!new_sacco._id) new_sacco._id = Schema.Types.ObjectId;
//     newRider.save()
//       .then((sacco) => {
//         console.log({ message: 'The sacco was added successfully' });
//         res.status(200).json({ sacco });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: `Unable to add the sacco: ${err}` });
//       });
//   });


app.post('*', (req, res) => {
  let { sessionId, serviceCode, from, text } = req.body
  let phoneNumber = from;

  const credentials = {
    apiKey: process.env.API_KEY,
    username: 'loopedin',
    from: '22384'
  }

  // Initialize the SDK
  const AfricasTalking = require('africastalking')(credentials);

  // Get the SMS service
  const sms = AfricasTalking.SMS;

  function sendMessage(client_phone_number, sms_message) {
    const options = {
      // Set the numbers you want to send to in international format
      to: client_phone_number,
      // Set your message
      message: sms_message,
      // Set your shortCode or senderId
      from: "22384"
    }
    
    sms.send(options)
      .then(console.log)
      .catch(console.log);
  }


  let client_phone_number = phoneNumber;
  let sms_message;


  console.log(`sms received`);
  Riders.findOne({ plateNumber: text }).exec().then((result) => {
    if (result) {
      let rider = result;
      sms_message =
        `
            Name: ${rider.name},
            Plate Number: ${rider.plateNumber},
            sacco: ${rider.sacco},
            Sacco Leader: ${rider.saccoLeader},
            Motorbike Make: ${rider.motorbikeMake},
            Sacco Code:${rider.saccoCode},
            Motorbike Owner: ${rider.bikeOwner},
            Rider's Contact:${rider.riderContact},
            Sacco Contact:${rider.saccoContact}`;

      sendMessage(client_phone_number, sms_message);
    } else {
      sms_message = `The rider is not registered.`
      sendMessage(client_phone_number, sms_message);
    }
  })
  .catch(err => {
    res.status(500).send({ message: `internal server error:${err}` });
    sms_message = `Nothing to send`;
    console.log("unable to send SMS - exception");
  });

  res.status(200).send('OK');

});


mongoose.connect(process.env.API_KEY2,
  {
    // useMongoClient: true,
    useNewUrlParser: true
  }
).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}).catch(err => {
  console.log(`unable to connect to databse:${err}`);
})
