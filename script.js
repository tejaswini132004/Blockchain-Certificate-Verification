
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = type + "-message";
}


// =====================================
// BLOCKCHAIN CONNECTION CONFIGURATION
// =====================================

// Ganache local blockchain URL
const GANACHE_URL = "http://127.0.0.1:7545";

// Your newly deployed Ganache contract address
const CONTRACT_ADDRESS = "0x2732eb2a7FDFb4354923BB348B95ae7e159cD3bA";

// Load the contract ABI
let CONTRACT_ABI = [];


// Load ABI and connect to Ganache
async function connectToBlockchain() {
    try {
        // Load ABI from JSON file
        const response = await fetch("./contractABI.json");

        if (!response.ok) {
            throw new Error("Could not load contract ABI");
        }

        CONTRACT_ABI = await response.json();

        // Connect to Ganache
        const provider = new ethers.JsonRpcProvider(GANACHE_URL);

        // Create contract instance
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            provider
        );

        console.log("Connected to Ganache successfully!");
        console.log("Contract address:", CONTRACT_ADDRESS);

        return contract;

    } catch (error) {
        console.error("Blockchain connection failed:", error);
        return null;
    }
}

// Establish the connection
const contractPromise = connectToBlockchain();



// Generate a SHA-256 hash from an uploaded PDF
async function generateFileHash(file) {
    // Read the PDF as binary data
    const fileBuffer = await file.arrayBuffer();

    // Generate the SHA-256 hash
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        fileBuffer
    );

    // Convert the hash into hexadecimal text
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}

// REGISTER CERTIFICATE ON BLOCKCHAIN
// =====================================


const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const certificateId =
        document.getElementById("certificateId").value.trim();

    const studentName =
        document.getElementById("studentName").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const pdfFile =
        document.getElementById("certificatePdf").files[0];

    const message =
        document.getElementById("registerMessage");

    // Step 1: Check required fields
    if (!certificateId || !studentName || !course || !pdfFile) {
        showMessage(
            message,
            "Please fill in all fields and upload a certificate PDF.",
            "error"
        );
        return;
    }

    // Step 2: Check PDF file type
    if (
        pdfFile.type !== "application/pdf" &&
        !pdfFile.name.toLowerCase().endsWith(".pdf")
    ) {
        showMessage(message, "Please upload a valid PDF file.", "error");
        return;
    }

    // Step 3: Check file size (maximum 10 MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
        showMessage(message, "PDF size must not exceed 10 MB.", "error");
        return;
    }

    try {
        showMessage(message, "Generating certificate hash...", "info");

        const certificateHash = await generateFileHash(pdfFile);

        const contract = await contractPromise;

        if (!contract) {
            throw new Error("Blockchain connection unavailable");
        }

        // Step 4: Check whether ID already exists
        const existingCertificate =
            await contract.getCertificate(certificateId);

        if (existingCertificate[2]) {
            showMessage(
                message,
                "This certificate ID is already registered.",
                "error"
            );
            return;
        }

        const provider = new ethers.JsonRpcProvider(GANACHE_URL);
        const signer = await provider.getSigner(0);

        const writableContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );

        showMessage(message, "Sending registration transaction...", "info");

        const transaction = await writableContract.registerCertificate(
            certificateId,
            certificateHash
        );

        showMessage(message, "Waiting for confirmation...", "info");

        await transaction.wait();

        showMessage(
            message,
            "Certificate registered successfully! ID: " +
            certificateId +
            " | Student: " + studentName +
            " | Course: " + course,
            "success"
        );

        console.log("Certificate registered successfully!");
        console.log("Transaction hash:", transaction.hash);
        console.log("Certificate Hash:", certificateHash);

    } catch (error) {
        console.error("Registration error:", error);

        showMessage(
            message,
            "Registration failed. Please check the certificate ID, blockchain connection, and browser console.",
            "error"
        );
    }
});



// Check that JavaScript has loaded
console.log("Certificate Verification System loaded successfully!");


// =====================================
// VERIFY CERTIFICATE
// =====================================

const verifyForm = document.getElementById("verifyForm");

verifyForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const certificateId =
        document.getElementById("verifyId").value.trim();

    const pdfFile =
        document.getElementById("verifyPdf").files[0];

    const message =
        document.getElementById("verifyMessage");

    // Step 1: Check required fields
    if (!certificateId || !pdfFile) {
        showMessage(
            message,
            "Please enter the Certificate ID and upload a PDF.",
            "error"
        );
        return;
    }

    // Step 2: Check PDF file type
    if (
        pdfFile.type !== "application/pdf" &&
        !pdfFile.name.toLowerCase().endsWith(".pdf")
    ) {
        showMessage(message, "Please upload a valid PDF file.", "error");
        return;
    }

    // Step 3: Check file size (maximum 10 MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
        showMessage(message, "PDF size must not exceed 10 MB.", "error");
        return;
    }

    try {
        showMessage(message, "Generating PDF hash...", "info");

        const uploadedHash = await generateFileHash(pdfFile);

        const contract = await contractPromise;

        if (!contract) {
            throw new Error("Blockchain connection unavailable");
        }

        showMessage(message, "Checking blockchain records...", "info");

        const result = await contract.getCertificate(certificateId);

        const registeredHash = result[1];
        const exists = result[2];

        if (!exists) {
            showMessage(
                message,
                "Certificate not found on blockchain.",
                "error"
            );
            return;
        }

        if (uploadedHash === registeredHash) {
            showMessage(
                message,
                "SUCCESS! Certificate is verified.",
                "success"
            );

            console.log("Certificate verified successfully!");

        } else {
            showMessage(
                message,
                "FAILED! Certificate does not match the registered document.",
                "error"
            );

            console.log("Certificate verification failed.");
        }

        console.log("Certificate ID:", certificateId);
        console.log("Uploaded Hash:", uploadedHash);
        console.log("Registered Hash:", registeredHash);

    } catch (error) {
        console.error("Verification error:", error);

        showMessage(
            message,
            "Verification error. Check the browser console.",
            "error"
        );
    }
});

