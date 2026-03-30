// spinnerboard

function startLoading(button, text) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `${text} <span class="spinner"></span>`;
}

function stopLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
}

// 
// 
document.body.style.backgroundColor = 'lightblue';

let signUpForm = document.getElementById('signUp');


  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

  import { getFirestore, collection, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
  
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
  

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB-Lh-2bdqY8AYc4dG1JhUEyDRR6jqwwjo",
    authDomain: "fluxbank-c296d.firebaseapp.com",
    projectId: "fluxbank-c296d",
    storageBucket: "fluxbank-c296d.firebasestorage.app",
    messagingSenderId: "463535168349",
    appId: "1:463535168349:web:549c4a5518f9033e15a6b4"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

    // get firstore  
  const db = getFirestore(app);
  console.log(db);
  
    //   get collection reference
  const colRef = collection(db, 'users');
  console.log(colRef);
  
// authenticatation
  const auth = getAuth();

//   add eventListener

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // alert('submitted');

    // spinnerboard for signup button
    const signUpBtn = document.getElementById("signUpBtn");
    startLoading(signUpBtn, "Signing Up");  

    let userEmail = signUpForm.email.value;
    let userPassword = signUpForm.password.value;
    let userConfpassword = signUpForm.confpassword.value;
    // let userName = signUpForm.username.value;
    let lastName = signUpForm.lastname.value;
    let firstName = signUpForm.firstname.value;
    let userPhone = signUpForm.phone.value;

    // let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        console.log(userAccountNumber);

    console.log(userEmail,userConfpassword,userPhone,firstName,lastName,userPassword);
    

    try {


        if (lastName.includes("@",".",",","$","&","!","#","%","/","?","<",">")) {
            Swal.fire ({
                title: "Invalid lastName",
                text: "Name should not contain symbols",
                icon: "error"
            });
            return;
        }

        if (firstName.includes("@",".",",","$","&","!","#","%","/","?","<",">")) {
            Swal.fire ({
                title: "Invalid firstName",
                text: "Name should not contain symbols",
                icon: "error"
            });
            return;
        }

        if (userPassword.length < 6) {
            Swal.fire({
                title: "Weak Password",
                text: "Password must be at least 6 characters.",
                icon: "warning"
            });
            return;
        }

        // Regular Expression (RegEx) to check password
        const hasNumber = /\d/.test(userPassword); // checks for number
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(userPassword); // checks special char

        if (!hasNumber && !hasSpecial) {
            Swal.fire({
                title: "Weak Password",
                text: "Password must contain at least a number or a special character.",
                icon: "error"
            });
            return;
        }

        if (!userEmail.includes("@")) {
            Swal.fire({
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                icon: "error"
            });
            return;
        }
        

        if (userPassword !== userConfpassword) {
            Swal.fire({
                title: "Password Error",
                text: "Passwords do not match",
                icon: "error"
            });
                return; 
        } 

        const createUser = await createUserWithEmailAndPassword(auth,userEmail,userPassword);
        console.log(createUser);

        
        const userQuerySnapshot = await setDoc(doc(db, "users", createUser.user.uid), {
            name:firstName + " " + lastName,
            firstname: firstName,
            lastname: lastName,
            phone:userPhone,
            email:userEmail,
            password:userPassword,
            accountNumber: userAccountNumber,
            balance: 0,
            role: "user",
            createdAt: serverTimestamp(),
            loanStatus: "none" | "active",
            loanAmount: 0,
            loanInterest: 0,
            loanTotal: 0,
            loanTakenAt: null,
            status: "active" | "frozen",
        });

        console.log(userQuerySnapshot);

        // alert('User created successfully');

        Swal.fire({
            title: `Welcome ${firstName}!`,
            text: "You have successfully signed up!",
            icon: "success"
        }).then(() => {
            window.location.href = "../pages/signIn.html";
        })

        signUpForm.reset();

        
        

    } catch (error) {

        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
            Swal.fire({
                title: "Email Already in Use",
                text: "The email you provided is already registered.",
                icon: "error"
            });
        
        } else {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        }
        
    } finally {
        stopLoading(signUpBtn);
    }

})
