const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const app = express();
const port = 8000;

const Counter = require("./models/count");
const User = require("./models/user");
const Project = require("./models/project");
const Achievement = require("./models/achievement");
const Eduqualification = require("./models/eduqualification");
const Personaldetail = require("./models/personaldetail");
const Skills = require("./models/skills");
const Sociallink = require("./models/sociallink");
const Contactreq=require("./models/contactreq")
const { jwt_secret } = require("../keys.js");
const requirelogin = require('./middlewares/requirelogin.js');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(cors({
    origin: '*', // Not recommended for production
    credentials: true,
}));
app.use(express.json())     //Middleware to parse JSON bodies

mongoose.connect("mongodb+srv://mohit:Indore123@cluster0.wkqzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connection.on("connected", () => {
    console.log("Succesfullky Connected To Database......")
})
mongoose.connection.on("error", () => {
    console.log("Not Connected To Database......")
})


app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/temp', requirelogin, (req, res) => {
    res.send("hiii.....")
})
app.post('/registeradmin', requirelogin, (req, res) => {
    const { name, email, username, password } = req.body;
    if (!name || !email || !password || !username) {
        return res.json({ error: "Please enter all details" })
    }
    const user = new User({
        name,
        email,
        username,
        password,
    })

    user.save()
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err))
    res.json({ message: "signup Successful" })
})

app.post('/adminlogin', (req, res) => {
    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.json({ error: "Please enter all fields" });
    }

    // Find the user by username
    User.findOne({ username: username })
        .then((saveUser) => {
            if (!saveUser) {
                // User not found
                return res.json({ error: "No user found" });
            }

            // Check if password matches
            if (saveUser.password !== password) {
                return res.json({ error: "Wrong password" });
            }

            // Sign the token (you can pass in only necessary info like user ID)
            const token = jwt.sign({ id: saveUser._id }, jwt_secret);

            // Respond with the token or any success message
            // res.cookie("rdffdgdfgf","hello")
            res.cookie('jwtoken', token, {
                httpOnly: true,
                secure: false, // false for localhost; true in production
                sameSite: 'None', // Cross-origin support
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            return res.json({ message: "Login successful", token: token, user: saveUser });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Server error" });
        });
});


app.post('/addsociallink',  (req, res) => {
    const { instagram, youtube, linkedin, codechef, codeforces, leetcode, gfg, github, website } = req.body;

    const sociallink = new Sociallink({
        instagram,
        youtube,
        linkedin,
        codechef,
        codeforces,
        leetcode,
        gfg,
        github,
        website

    })

    sociallink.save()
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err))
    res.json({ message: "You Social Media Links are saved" })
})

app.put('/updatesociallink', (req, res) => {
    const { id, instagram, youtube, linkedin, codechef, codeforces, leetcode, gfg, github, website } = req.body; // Extract ID and fields to update

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing social link ID" });
    }

    // Create the update object dynamically
    const update = {};
    if (instagram) update.instagram = instagram;
    if (youtube) update.youtube = youtube;
    if (linkedin) update.linkedin = linkedin;
    if (codechef) update.codechef = codechef;
    if (codeforces) update.codeforces = codeforces;
    if (leetcode) update.leetcode = leetcode;
    if (gfg) update.gfg = gfg;
    if (github) update.github = github;
    if (website) update.website = website;

    // Find the social link document by ID and update
    Sociallink.findByIdAndUpdate(
        id,       // Find by social link ID
        update,   // Fields to update
        { new: true, runValidators: true } // Return the updated document and apply schema validation
    )
        .then((updatedSocialLink) => {
            if (!updatedSocialLink) {
                return res.status(404).json({ error: "No social link found with the given ID" });
            }
            res.json({ message: "Social links updated successfully", updatedSocialLink });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to update social links" });
        });
});


app.post('/addskill',  (req, res) => {
    const { skillname , percentage} = req.body;

    const skilll = new Skills({
        skillname,
        percentage

    })
    console.log(skillname)
    skilll.save()
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err))
    res.json({ message: "Your new Skill added successfully" })
})
app.put('/updateskill', (req, res) => {
    const { id, skillname, percentage } = req.body; // Extract ID and fields to update

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing skill ID" });
    }

    // Create the update object dynamically
    const update = {};
    if (skillname) update.skillname = skillname;
    if (percentage) update.percentage = percentage;

    // Find the skill by ID and update
    Skills.findByIdAndUpdate(
        id,       // Find by skill ID
        update,   // Fields to update
        { new: true, runValidators: true } // Return the updated document and apply schema validation
    )
        .then((updatedSkill) => {
            if (!updatedSkill) {
                return res.status(404).json({ error: "No skill found with the given ID" });
            }
            res.json({ message: "Skill updated successfully", updatedSkill });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to update skill" });
        });
});
// Get route to fetch user's skills
app.get('/getskills', (req, res) => {

    Skills.find()
        .then((skills) => {
            if (skills.length === 0) {
                return res.status(404).json({ error: "No skills found" });
            }
            res.json({ message: "Skills fetched successfully", skills });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch skills" });
        });
});


app.post('/addproject',  (req, res) => {
    const { name , description , techstack , image} = req.body;

    const project = new Project({
        name , 
        description , techstack , 
        image

    })

    project.save()
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err))
    res.json({ message: "Your Project added successfully" })
})
app.put('/addproject', (req, res) => {
    const { id, name, description, techstack, image } = req.body; // Extract ID and fields to update

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing project ID" });
    }

    // Create the update object dynamically
    const update = {};
    if (name) update.name = name;
    if (description) update.description = description;
    if (techstack) update.techstack = techstack;
    if (image) update.image = image;

    // Find the project by ID and update
    Project.findByIdAndUpdate(
        id,       // Find by project ID
        update,   // Fields to update
        { new: true, runValidators: true } // Return the updated document and apply schema validation
    )
        .then((updatedProject) => {
            if (!updatedProject) {
                return res.status(404).json({ error: "No project found with the given ID" });
            }
            res.json({ message: "Project updated successfully", updatedProject });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to update the project" });
        });
});


app.get('/getpersonaldetail', (req, res) => {
    Personaldetail.findOne()  // Fetch the single record in the collection
        .then((personalDetail) => {
            if (!personalDetail) {
                return res.status(404).json({ error: "No personal details found" });
            }
            res.json({ personalDetail });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to retrieve personal details" });
        });
});
app.post('/addpersonaldetail', (req, res) => {
    const { name, phoneno, whatsappno, email,photo1,photo2,desc1,desc2,desc3} = req.body;

    const personalDetail = new Personaldetail({
        name,
        phoneno,
        whatsappno,
        email,
        photo1,
        photo2,
        desc1,
        desc2,
        desc3,
    });

    personalDetail.save()
        .then((result) => {
            console.log(result);
            res.json({ message: "Personal details added successfully" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to add personal details" });
        });
});

app.put('/addpersonaldetail', (req, res) => {
    const { id, name, email, phoneno, whatsappno, photo1, photo2, desc1, desc2,desc3 } = req.body;

    // Validate that id is provided
    if (!id) {
        return res.status(400).json({ error: "ID is required to update personal details" });
    }

    // Create an update object with only the fields that are provided
    const update = {};
    if (name) update.name = name;
    if (phoneno) update.phoneno = phoneno;
    if (whatsappno) update.whatsappno = whatsappno;
    if (email) update.email = email;
    if (photo1) update.photo1 = photo1;
    if (photo2) update.photo2 = photo2;
    if (desc1) update.desc1 = desc1;
    if (desc2) update.desc2 = desc2;
    if (desc2) update.desc3 = desc3;

    // Update personal details based on the id using findOneAndUpdate
    Personaldetail.findOneAndUpdate(
        { _id: id }, // Query to find the document by id
        update,      // Fields to update
        { new: true, runValidators: true } // Return the updated document and run validators
    )
        .then((updatedDetail) => {
            if (!updatedDetail) {
                return res.status(404).json({ error: "No personal details found for the given id" });
            }
            res.json({ message: "Personal details updated successfully", updatedDetail });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to update personal details" });
        });
});



app.post('/addachievement', (req, res) => {
    const { name, Organised_by, mode, desc, image } = req.body;

    const achievement = new Achievement({
        name,
        Organised_by,
        mode,
        desc,
        image,
    });

    achievement.save()
        .then((result) => {
            console.log(result);
            res.json({ message: "Achievement added successfully" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to add achievement" });
        });
});

app.put('/addachievement', (req, res) => {
    const { id, name, Organised_by, mode, desc, image } = req.body; // Extract ID and fields to update

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing achievement ID" });
    }

    // Create the update object dynamically
    const update = {};
    if (name) update.name = name;
    if (Organised_by) update.Organised_by = Organised_by;
    if (mode) update.mode = mode;
    if (desc) update.desc = desc;
    if (image) update.image = image;

    // Find the achievement by ID and update
    Achievement.findByIdAndUpdate(
        id,       // Find by achievement ID
        update,   // Fields to update
        { new: true, runValidators: true } // Return the updated document and apply schema validation
    )
        .then((updatedAchievement) => {
            if (!updatedAchievement) {
                return res.status(404).json({ error: "No achievement found with the given ID" });
            }
            res.json({ message: "Achievement updated successfully", updatedAchievement });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to update achievement" });
        });
});

app.post('/addeduqualification', (req, res) => {
    const { year, institute_name, qualification_name, score } = req.body;

    const eduQualification = new Eduqualification({
        year,
        institute_name,
        qualification_name,
        score,
    });

    eduQualification.save()
        .then((result) => {
            console.log(result);
            res.json({ message: "Educational qualification added successfully" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to add educational qualification" });
        });
});
app.get('/count', async (req, res) => {
    try {
        let cnt = await Counter.findOne();
        if (!cnt) {
            cnt = new Counter({ count: 1 }); // Initialize with 1 view
        } else {
            cnt.count += 1; // Increment view count
        }
        await cnt.save();
        res.json(cnt);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' });
    }
})
app.get("/contactreq", async (req, res) => {
    try {
        // Retrieve all documents from the collection
        const requests = await Contactreq.find();
        
        res.status(200).json({
            message: "Form requests retrieved successfully!",
            data: requests,
        });
    } catch (error) {
        console.error("Error fetching form requests:", error);
        res.status(500).json({ message: "An error occurred while retrieving form requests." });
    }
});
app.post("/submit-form", async (req, res) => {
    try {
        const { name, phoneno, email, subject, description } = req.body;

        // Create a new document with the current date
        const contactreq = new Contactreq({
            name,
            phoneno,
            email,
            subject,
            description,
            date: new Date() // Adding the current date
        });

        // Save to the database
        await contactreq.save();

        res.status(201).json({ message: "Form data saved successfully!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "An error occurred while saving form data." });
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port)
})
