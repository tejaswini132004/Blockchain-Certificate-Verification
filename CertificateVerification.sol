// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    // Store the admin's blockchain address
    address public admin;

    // Structure to store certificate information
    struct Certificate {
        string certificateId;
        string certificateHash;
        bool exists;
    }

    // Store certificates using their certificate IDs
    mapping(string => Certificate) private certificates;

    // Set the contract deployer as the admin
    constructor() {
        admin = msg.sender;
    }

    // Allow only the admin to register certificates
    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only admin can register certificates"
        );
        _;
    }

    // Register a new certificate on the blockchain
    function registerCertificate(
        string memory _certificateId,
        string memory _certificateHash
    ) public onlyAdmin {

        // Check that the certificate ID is not empty
        require(
            bytes(_certificateId).length > 0,
            "Certificate ID cannot be empty"
        );

        // Check that the hash is not empty
        require(
            bytes(_certificateHash).length > 0,
            "Certificate hash cannot be empty"
        );

        // Prevent duplicate certificate IDs
        require(
            !certificates[_certificateId].exists,
            "Certificate ID already registered"
        );

        // Store the certificate ID and its hash
        certificates[_certificateId] = Certificate(
            _certificateId,
            _certificateHash,
            true
        );
    }

    // Verify an uploaded certificate's hash
    function verifyCertificate(
        string memory _certificateId,
        string memory _certificateHash
    ) public view returns (bool) {

        // Return false if the certificate ID is not registered
        if (!certificates[_certificateId].exists) {
            return false;
        }

        // Compare the registered hash with the uploaded PDF's hash
        return keccak256(
            bytes(certificates[_certificateId].certificateHash)
        ) == keccak256(bytes(_certificateHash));
    }

    // Retrieve the registered certificate information
    function getCertificate(
        string memory _certificateId
    )
        public
        view
        returns (
            string memory certificateId,
            string memory certificateHash,
            bool exists
        )
    {
        Certificate memory cert = certificates[_certificateId];

        return (
            cert.certificateId,
            cert.certificateHash,
            cert.exists
        );
    }
}
