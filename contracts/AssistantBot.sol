// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ILlmOracle {
    function generateAssistantResponse(uint sessionId) external returns (uint);
}

contract AssistantBot {
    struct Interaction {
        string participant;
        string text;
    }

    struct ConversationSession {
        address user;
        Interaction[] interactions;
        uint interactionCount;
    }

    address private botAdmin;
    address public oracleService;

    constructor(address initialOracleService) {
        botAdmin = msg.sender;
        oracleService = initialOracleService;
    }

    modifier onlyBotAdmin() {
        require(msg.sender == botAdmin, "Caller is not the bot admin");
        _;
    }

    modifier onlyOracleService() {
        require(msg.sender == oracleService, "Caller is not the oracle service");
        _;
    }

    event OracleServiceUpdated(address indexed newOracleService);

    function setOracleService(address newOracleService) public onlyBotAdmin {
        oracleService = newOracleService;
        emit OracleServiceUpdated(newOracleService);
    }

    event ConversationStarted(address indexed user, uint indexed sessionId);
    mapping(uint => ConversationSession) public conversationSessions;
    uint private conversationSessionCount;

    function initiateConversation(string memory initialText) public returns (uint) {
        ConversationSession storage session = conversationSessions[conversationSessionCount];

        session.user = msg.sender;
        Interaction memory newInteraction;
        newInteraction.text = initialText;
        newInteraction.participant = "user";
        session.interactions.push(newInteraction);
        session.interactionCount = 1;

        uint currentId = conversationSessionCount;
        conversationSessionCount = conversationSessionCount + 1;

        ILlmOracle(oracleService).generateAssistantResponse(currentId);
        emit ConversationStarted(msg.sender, currentId);

        return currentId;
    }

    function addInteraction(string memory userInput, uint sessionId) public {
        ConversationSession storage session = conversationSessions[sessionId];
        require(
            keccak256(abi.encodePacked(session.interactions[session.interactionCount - 1].participant)) == keccak256(abi.encodePacked("assistant")),
            "No response to previous interaction"
        );
        require(
            session.user == msg.sender, "Only session user can add interactions"
        );

        Interaction memory newInteraction;
        newInteraction.text = userInput;
        newInteraction.participant = "user";
        session.interactions.push(newInteraction);
        session.interactionCount++;
        ILlmOracle(oracleService).generateAssistantResponse(sessionId);
    }

    function getConversationTexts(uint sessionId) public view returns (string[] memory) {
        string[] memory texts = new string[](conversationSessions[sessionId].interactions.length);
        for (uint i = 0; i < conversationSessions[sessionId].interactions.length; i++) {
            texts[i] = conversationSessions[sessionId].interactions[i].text;
        }
        return texts;
    }

    function getConversationParticipants(uint sessionId) public view returns (string[] memory) {
        string[] memory participants = new string[](conversationSessions[sessionId].interactions.length);
        for (uint i = 0; i < conversationSessions[sessionId].interactions.length; i++) {
            participants[i] = conversationSessions[sessionId].interactions[i].participant;
        }
        return participants;
    }

    function onOracleAssistantResponse(
        uint sessionId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracleService {
        ConversationSession storage session = conversationSessions[sessionId];
        require(
            keccak256(abi.encodePacked(session.interactions[session.interactionCount - 1].participant)) == keccak256(abi.encodePacked("user")),
            "No interaction to respond to"
        );

        Interaction memory newInteraction;
        newInteraction.text = response;
        newInteraction.participant = "assistant";
        session.interactions.push(newInteraction);
        session.interactionCount++;
    }
}
