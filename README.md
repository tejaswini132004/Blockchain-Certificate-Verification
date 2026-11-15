# Blockchain-Based Certificate Verification System

## About the Project

The Blockchain-Based Certificate Verification System is a web application developed to verify the authenticity and integrity of digital certificates.

The system uses blockchain technology and SHA-256 hashing to check whether an uploaded certificate PDF matches the originally registered document.

An administrator can register certificates, and users can verify them using their Certificate ID and PDF file.

If the uploaded PDF matches the registered document, the system displays a successful verification message. If the document has been modified, verification fails.

## Features

- Certificate registration through an Admin Portal.
- SHA-256 hash generation for PDF files.
- Blockchain-based certificate record storage.
- Certificate verification using Certificate ID.
- Detection of modified certificate documents.
- Duplicate Certificate ID prevention.
- Input validation for required fields and PDF files.
- Admin-only certificate registration.
- Success, failure, and error messages.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Website structure |
| CSS | Website styling |
| JavaScript | Application functionality |
| Solidity | Smart contract development |
| Remix IDE | Smart contract compilation and deployment |
| Ganache | Local blockchain network |
| Ethers.js | Blockchain interaction |
| SHA-256 | Certificate hash generation |
| Visual Studio Code | Code editor |

## Project Structure

```text
BlockchainCertificateVerification/
│
├── index.html
├── style.css
├── script.js
├── contractABI.json
└── CertificateVerification.sol
```

## How the Project Works

### 1. Certificate Registration

1. The administrator enters the Certificate ID, Student Name, and Course Name.
2. The administrator uploads the certificate PDF.
3. JavaScript generates the SHA-256 hash of the PDF.
4. The Certificate ID and generated hash are sent to the smart contract.
5. The smart contract stores the certificate record on the blockchain.

### 2. Certificate Verification

1. The user enters the Certificate ID.
2. The user uploads the certificate PDF.
3. The system generates the SHA-256 hash of the uploaded PDF.
4. The registered hash is retrieved from the blockchain.
5. Both hashes are compared.
6. The system displays the verification result.

### Verification Results

- **Success:** Uploaded PDF matches the registered certificate.
- **Failed:** Uploaded PDF does not match the registered certificate.
- **Not Found:** Certificate ID is not registered on the blockchain.

## Hardware Requirements

- Processor: Intel Core i3 or above.
- RAM: Minimum 4 GB.
- Operating System: Windows 10/11.
- Storage: Minimum 5 GB free space.

## Software Requirements

- Visual Studio Code
- Remix IDE
- Ganache
- Google Chrome
- Node.js (if required by the development environment)
- Live Server extension

## How to Run the Project Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/tejaswini132004/Blockchain-Certificate-Verification.git
```

### Step 2: Open the Project

Open the downloaded project folder in Visual Studio Code.

### Step 3: Start Ganache

- Open Ganache.
- Start your local blockchain.
- Ensure the RPC URL matches the one configured in `script.js`.
- Ensure the deployed contract address matches the address in `script.js`.

### Step 4: Run the Website

Open `index.html` using the Live Server extension in Visual Studio Code.

### Step 5: Test the Application

- Register a certificate using the Admin Portal.
- Upload the original PDF for verification.
- Upload a modified PDF to test verification failure.

## Important Notes

- The current project uses Ganache as a local blockchain network.
- Ganache must be running while using the application.
- The smart contract must be deployed before using the website.
- The original PDF is not stored on the blockchain. Only the Certificate ID and its SHA-256 hash are stored.
- This project verifies document integrity against a registered file. It does not independently confirm whether the original certificate was genuinely issued by an institution.
- The current configuration is intended for local development and demonstration, not public production deployment.

## Future Improvements

- Deploy the smart contract on a public blockchain.
- Add administrator authentication.
- Add QR-code-based certificate verification.
- Support multiple educational institutions.
- Develop a certificate management dashboard.
