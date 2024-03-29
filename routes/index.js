const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const multer = require('multer');
require('dotenv').config();
const jimp = require('jimp');
const express = require('express');
const { login } = require('../helpers/Login');
const { getDate } = require('../helpers/getDate');
const authMiddleware = require('../middleware/authMiddleware');
const State = require('../models/stateModel');
const adminMiddleware = require('../middleware/adminMiddleware');
const City = require('../models/cityModel');
const SiteName = require('../models/SiteName');
const Department = require('../models/DepartmentModel')
const Image = require('../models/imageModel');
const Folder = require('../models/FolderModel');
const router = express.Router();

s3.config.update({
    //ADD AWS CONFIG
    accessKeyId: 'AKIAYRXPCJNK73TET35C',
    secretAccessKey: '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',
    region: 'ap-south-1',
    signatureVersion: 'v4'
});



const params = {
    Bucket: process.env.AWS_BUCKET_NAME
};




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await login(email, password);

        res.json({ user, token });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/create-state', async (req, res) => {

    const { state_name } = req.body;

    try {
        const newState = new State({
            state_name
        });

        const state = await newState.save();
        res.json(state);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

});


router.get('/states', async (req, res) => {

    try {
        const states = await State.find();
        const filteredStates = states.map(state => {
            return {
                "state_name": state.state_name
            }
        });

        res.json(filteredStates);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/create-city', async (req, res) => {
    const { city_name, state_name } = req.body;

    try {
        const newCity = new City({
            city_name,
            state_name
        });

        const city = await newCity.save();
        res.json(city);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }

});

router.get('/cities', async (req, res) => {
    try {
        const stateName = req.query.state_name;

        const cities = await City.find().populate({
            path: 'state',
            match: { state_name: stateName }
        });


        const filteredCities = cities.filter(item => item.state !== null);
        const filteredCities_ = filteredCities.map(city => {
            return {
                "city_name": city.city_name
            }
        });



        res.json(filteredCities_);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/sitenames', async (req, res) => {

    const { cityName, siteName } = req.body;

    try {

        // Get city _id
        const city = await City.findOne({ city_name: cityName });
        if (!city) {
            return res.status(400).json({ error: 'City not found' });
        }

        // Create new SiteName
        const newSiteName = new SiteName({
            site_name: siteName,
            city: city._id
        });

        // Save sitename
        const createdSiteName = await newSiteName.save();

        res.json(createdSiteName);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

});


router.get('/sitenames', async (req, res) => {
    res.json(await SiteName.find({}, { __v: false }))
})

router.post('/department', async (req, res) => {

    const { department_name } = req.body;

    try {

        const newDepartment = new Department({
            department_name
        });

        const createdDepartment = await newDepartment.save();

        res.json(createdDepartment);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

});

router.get('/department', async (req, res) => {
    res.json(await Department.find({}, { __v: false }))
})

router.post('/create-folder', async (req, res) => {
    try {
        const { stateName, cityName, siteName } = req.body;
        const istDate = getDate()


        const state = await State.findOne({ state_name: stateName });

        let city = await City.findOne({ city_name: cityName, state: state._id });

        if (!city) {
            city = new City({ city_name: cityName, state: state._id });
            await city.save()
        }

        let site = await SiteName.findOne({ site_name: siteName, city: city._id });

        if (!site) {
            site = new SiteName({ site_name: siteName, city: city._id });
            await site.save()
        }

        const departments = await Department.find({})

        for (let department_ = 0; department_ < departments.length; department_++) {
            const match = {
                state: state._id,
                city: city._id,
                sitename: site._id,
                date: istDate,
                department: departments[department_]._id
            };

            // Search for matching folder 
            let folder = await Folder.findOne(match);

            if (!folder) {
                folder = new Folder(match)
                folder = await folder.save();
            }
        }
        res.json({ msg: "Folder created" })
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Error!', error: err });
    }

})

//IMAGE ROUTES
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5 MB
    },
    fileFilter: (req, file, cb) => {
        // Check if the file type is an image
        const allowedMimes = ['image/jpg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true); // Allow the upload
        } else {
            cb(new Error('Invalid file type. Only image files are allowed.')); // Reject the upload
        }
    },
});

// POST /images
router.post('/image', upload.single('image'), async (req, res) => {

    // Get data from request 
    const { stateName, cityName, siteName, departmentName } = req.body;
    const file = req.file;



    const watermarkFile = 'https://qcin.org/wp-content/uploads/2023/06/qci-logo-1.png';

    try {

        const istDate = getDate()
        const folderPath = `${stateName}/${cityName}/${istDate}/${siteName}/${departmentName}/`


        const state = await State.findOne({ state_name: stateName });

        const city = await City.findOne({ city_name: cityName, state: state._id });

        const site = await SiteName.findOne({ site_name: siteName, city: city._id });

        const department = await Department.findOne({ department_name: departmentName });


        const match = {
            state: state._id,
            city: city._id,
            sitename: site._id,
            date: istDate,
            department: department._id
        };

        // Search for matching folder 
        let folder = await Folder.findOne(match);

        if (!folder) {
            folder = new Folder(match)
            folder = await folder.save();
        }

        // Create image referencing folde

        const uploadedImage = await jimp.read(file.buffer);
        // console.log('Uploaded Image:', uploadedImage);

        const watermarkImage = await jimp.read(watermarkFile);
        const newWatermarkImage = watermarkImage.resize(250, 88);
        const padding = 20;
        // const increasedSize = 1.2;
        const newWidth = newWatermarkImage.getWidth() * 1.1;
        const newHeight = newWatermarkImage.getHeight() * 1.2;
        const centerX = (newWidth - watermarkImage.getWidth()) / 2;
        const centerY = (newHeight - watermarkImage.getHeight()) / 2;
        // console.log('Watermark Image:', watermarkImage);
        const whiteBg = new jimp(newWidth, newHeight, 0xffffffff);
        whiteBg.composite(newWatermarkImage, centerX, centerY);


        const watermarkWidth = uploadedImage.getWidth() * 0.2;
        watermarkImage.resize(watermarkWidth, jimp.AUTO);
        const watermarkX = uploadedImage.getWidth() - whiteBg.getWidth() - padding; // Adjust the value as needed
        const watermarkY = padding; // Top position remains the same
        uploadedImage.composite(whiteBg, watermarkX, watermarkY);

        // const watermarkedImageBuffer = await uploadedImage.getBufferAsync(jimp.MIME_JPEG);
        const compressedImageBuffer = await uploadedImage.quality(60).getBufferAsync(jimp.MIME_JPEG);

        // Upload file to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folderPath}${file.originalname}`,
            Body: compressedImageBuffer,
            ContentType: uploadedImage.getMIME(),
        };

        s3.upload(params, async (err, data) => {
            if (err) {
                console.error('S3 upload error:', err);
                return res.status(500).send(err);
            }
            const image = new Image({
                image_url: data.Key,
                folder_path: folder._id
            });

            const savedImage = await image.save();

            res.json(savedImage);
        });

    } catch (err) {
        // error handling 
        console.error(err);
        res.status(500).send('Server Error');
    }

});

router.get('/image', (req, res) => {

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.query.key,
        Expires: 60 * 3,
    };
    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            console.error('Presign error:', err);
            return res.status(500).send('Presign error');
        }
        res.json({ "url": url });
        // console.log('>>>>>>>>>>>>>>',url);
    });

});

router.get('/fetch-folders', async (req, res) => {
    try {
        const param = req.query.get

        if (param === 'state') {
            const result = await State.find({
                _id: { $in: await Folder.distinct('state') }
            }, {
                _id: 0,
                __v: 0
            });

            //   Folder.distinct('state') = list of distinct states i.e. state._id
            // $in: ['_id', '__id'] = Find any from the list
            res.json(result)

        } else if (param === 'city') {
            const state = req.query.state
            const theState = await State.findOne({ state_name: state })

            if (!theState) {
                res.json({ msg: `State : ${state} not found` })
                return
            }

            const result = await City.find({
                state: theState._id,
                _id: { $in: await Folder.distinct('city') }
            }, {
                _id: 0,
                __v: 0,
                state: 0
            });
            res.json(result)

        } else if (param === 'date') {
            const state = req.query.state
            const city = req.query.city

            const theState = await State.findOne({ state_name: state })

            if (!theState) {
                res.json({ msg: `State: ${state} not found` })
                return
            }

            const theCity = await City.findOne({ city_name: city, state: theState._id })

            if (!theCity) {
                res.json({ msg: `City: ${city} not found` })
                return
            }
            const result = await Folder.distinct('date', { city: theCity._id })

            res.json(result)

        }
        else if (param === 'sitename') {
            const state = req.query.state
            const city = req.query.city
            const date = req.query.date
            const theState = await State.findOne({ state_name: state })

            if (!theState) {
                res.json({ msg: `State: ${state} not found` })
                return
            }

            const theCity = await City.findOne({ city_name: city, state: theState._id })

            if (!theCity) {
                res.json({ msg: `City: ${city} not found` })
                return
            }

            const result = await SiteName.find({
                _id: { $in: await Folder.distinct('sitename', { city: theCity._id, date: date }) }
            }, {
                _id: 0,
                city: 0,
                __v: 0
            })
            res.json(result)
        }
        else if (param === 'department') {
            const state = req.query.state
            const city = req.query.city
            const date = req.query.date
            const sitename = req.query.sitename
            const theState = await State.findOne({ state_name: state })

            if (!theState) {
                res.json({ msg: `State: ${state} not found` })
                return
            }

            const theCity = await City.findOne({ city_name: city, state: theState._id })

            if (!theCity) {
                res.json({ msg: `City: ${city} not found` })
                return
            }
            
            const theSitename = await SiteName.findOne({ city: theCity._id, site_name: sitename })
            
            if (!theSitename) {
                res.json({ msg: `Site: ${sitename} not found` })
                return
            }

            const result = await Department.find({
                _id: { $in: await Folder.distinct('department', { sitename: theSitename._id, city: theCity._id, date: date, state: theState }) }
            }, {
                _id:0,
                __v:0
            })
            res.json(result)
        }


    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})



module.exports = router