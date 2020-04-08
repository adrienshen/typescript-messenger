export default {
  SSE_LOCAL_BASE_URL: "http://localhost:3000",
  TEST_SORA_BASE_URL: "https://api.test.sora.ai",
  PROD_SORA_BASE_URL: "https://api.sora.ai",
  SORA_TEST_SSE_BASE_URL: "sora.",
  SSE_LOCAL_CHATBOT: "/chatbot",
  SSE_CHATBOT: "/chatbot/transcript/stream",
  AWS_EVAPORATE: {
    MAX_RETRY_BACKOFF_SECS: 99999999,
    RETRY_BACKOFF_POWER: 10,
    AWS_SIGNITURE_VERSION: 2,
    LOGGING: false,
    SERVER_SIDE_ENCRYPTION: "AES256",
  },
  TNC_MINIMUM: 4,
}