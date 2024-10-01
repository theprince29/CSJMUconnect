const {pool,queryAsync} = require("../routes/db-config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailService = require('./emailService');
const otpGenerator = require('otp-generator');




// ===========================================================================================================================
const generateVerificationToken = () => {
    return otpGenerator.generate(20, { digits: true, alphabets: true, upperCase: true, specialChars: true });
  };
  
  const sendVerificationEmail = (username,email, token) => {
    const verificationLink = `${process.env.BASE_URL}/auth/verify?token=${token}`;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<h2 style="color:blue;">Email Verification</h2>
              <p>Dear,<strong>${username}</strong></p>
              <p>Please click the following link to verify your email:</p>
              Click <a href="${verificationLink}">here</a> to verify your email.
              <p>If you did not request this verification, you can ignore this email.</p>
              <p>Thank you!</p>`,
    };
  
    emailService.sendMail(mailOptions)
      .then(info => console.log('Email sent:', info.response))
      .catch(error => console.error('Error sending email:', error));
  };
  
  exports.showRegistrationForm = (req, res) => {
    res.render('register',{message: null});
  };
  
  exports.registerUser = async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;
  
    if (password !== passwordConfirm) {
      return res.render('register', { message: 'Your passwords do not match' });
    }
    
    
  
    try {
      // Check if the user with the specified email already exists as unverified
      const existingUnverifiedUser = await queryAsync('SELECT * FROM users WHERE email = ? AND status = "unverified"', [email]);
  
      if (existingUnverifiedUser.length > 0) {
        // If the user exists as unverified, update their details
        const userId = existingUnverifiedUser[0].id;
        const hashedPassword = await bcrypt.hash(password, 8);
        const verificationToken = generateVerificationToken();
  
        // Update user details
        await queryAsync('UPDATE users SET username = ?, password = ?, verification_token = ? WHERE id = ?', [username, hashedPassword, verificationToken, userId]);
  
        // Send verification email with the new token
        await sendVerificationEmail(username,email, verificationToken);
        return res.render('verifyEmail', { email });
      }
  
      const existingUser = await queryAsync('SELECT * FROM users WHERE email = ? AND status = "verified"', [email]);
  
      if (existingUser.length > 0) {
        return res.render('register', { message: 'User with this email is already registered and verified.' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 8);
      const verificationToken = generateVerificationToken();
  
      const insertQuery = 'INSERT INTO users SET ?';
      const regResults = await queryAsync(insertQuery, {
        username,
        email,
        password: hashedPassword,
        verification_token: verificationToken,
      });
  
      // Send verification email with the token
      await sendVerificationEmail(username,email, verificationToken);
      return res.render('verifyEmail', { email });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.render('register', { message: 'Error registering user' });
    }
  };
  
  exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
  
      const results = await queryAsync('SELECT * FROM users WHERE verification_token = ?', [token]);
  
      if (results.length > 0) {
        const userId = results[0].id;
  
        // Update user status to "verified" in the database
        await queryAsync('UPDATE users SET status = "verified" WHERE id = ?', [userId]);
        return res.render('verificationSuccess'); // Render a success view
      } else {
        return res.render('verificationFailed'); // Render a failure view
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      return res.render('verificationFailed'); // Render a failure view
    }
  };
  
// ===========================================================================================================================
exports.login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.render('login',{message:"Please Complete whole detail"});
    
    else{
        pool.query('SELECT * FROM users WHERE email =? AND status = "verified" ',[email],async (err,result)=>{
            if(err) throw err;
            if(!result.length || !await bcrypt.compare(password,result[0].password))
            //  return res.json({status:'error', error:"Incorrect Email or Password "});
             return res.render('login',{message:"Incorrect Email or Password "});
            else{
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES
                })
                const cookieOptions = {
                    expiresIn:new Date(Date.now()+ process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly:true
                }
                res.cookie("userRegistered",token,cookieOptions);
                return res.render('login',{
                    success : 'Successfully logged in'
                });
            } 
        })
    }
};

exports.loggedIn = (req,res,next)=>{
    if(!req.cookies.userRegistered) return next();

    try{
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        pool.query('SELECT * FROM users WHERE id = ? AND status = "verified" ',[decoded.id],(err,result)=>{
            if(err) return next();
            // req.user = result[0];
            
            if (result && result.length > 0) {
                req.user = result[0]; // Set user details in request object
            }
            return next();
        })
    }catch(err)
    {
        if(err) return next()
     }

};

exports.renderDashboard = (req, res) => {
    // Check if user details are available in the request object
    if (req.user) {
        // If user details exist, render the dashboard with the user information
        const users = {
            score: 1000,
            likes: 500,
            ranking: 10
            // Add other user-related data as needed
        };
        return res.render('dashbord', {
            username: req.user.username,
            email: req.user.email,
            user:users
        });
    } else {
        // If user details are not available, handle the scenario (e.g., redirect to login)
        return res.redirect('/login');
    }
};

exports.renderDashboardprofile = (req, res) => {
    // Check if user details are available in the request object
    if (req.user) {
        // If user details exist, render the dashboard with the user information
        const createdDate = new Date(req.user.created_at)
        const formattedDate = createdDate.toLocaleDateString('en-GB');
        return res.render('profile', {
            username: req.user.username,
            email: req.user.email,
            since: formattedDate
        });
    } else {
        // If user details are not available, handle the scenario (e.g., redirect to login)
        return res.redirect('/login');
    }
};
exports.renderDashboardupload = (req, res) => {
    // Check if user details are available in the request object
    if (req.user) {
        // If user details exist, render the dashboard with the user information
        return res.render('upload', {
            user_id: req.user.id,
            username: req.user.username,
        });
    } else {
        // If user details are not available, handle the scenario (e.g., redirect to login)
        return res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('userRegistered'); // Clear the authentication cookie
    res.redirect('/login'); // Redirect the user to the login page or any other appropriate page
};

