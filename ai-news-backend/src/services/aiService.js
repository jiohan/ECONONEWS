// Google Gemini API를 사용하여 뉴스 분석 및 검수 (AI Agent)

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');
const PROMPTS = require('../config/prompts');

/**
 * Gemini 모델 초기화
 */
const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in .env');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // n8n은 PaLM일 수 있으나 최신 Flash 권장
};

/**
 * 1단계: 뉴스 텍스트를 JSON으로 구조화 (Agent)
 * @param {string} rawText - Perplexity 검색 결과
 * @returns {Promise<Object[]>} - 뉴스 JSON 배열
 */
const analyzeNews = async (rawText) => {
    try {
        const model = getModel();
        const today = new Date().toISOString().split('T')[0];

        // 100일 전 날짜 계산 (오래된 뉴스 필터링용)
        const past = new Date();
        past.setDate(past.getDate() - 100);
        const pastDate = past.toISOString().split('T')[0];

        // 프롬프트 치환
        const userPrompt = PROMPTS.ANALYZE_NEWS.user
            .replace('{{input_text}}', rawText)
            .replace('{{today_date}}', today)
            .replace('{{past_date}}', pastDate);

        logger.info('🧠 Gemini(Agent) 분석 시작...');

        // Generate Content
        const result = await model.generateContent([
            { text: PROMPTS.ANALYZE_NEWS.system }, // 시스템 메시지를 user 앞에 배치하거나 API 지원 맞춰야 함
            // Gemini SDK는 시스템 메시지를 별도로 지원하지만 generateContent에서는 그냥 앞에 붙여도 됨
            { text: userPrompt }
        ]);

        const response = await result.response;
        let text = response.text();

        return parseJsonSafe(text);

    } catch (error) {
        logger.error(`❌ Gemini 분석 실패: ${error.message}`);
        throw error;
    }
};

/**
 * 2단계: 결과 검수 및 용어 개수 보정 (Critic Agent)
 * @param {Object[]} newsJson - 1단계 결과
 * @returns {Promise<Object[]>} - 최종 JSON
 */
const refineAnalysis = async (newsJson) => {
    try {
        const model = getModel();
        const jsonString = JSON.stringify(newsJson, null, 2);

        // 프롬프트 치환
        const userPrompt = PROMPTS.CRITIC_NEWS.user.replace('{{input_json}}', jsonString);

        logger.info('⚖️ Gemini(Critic) 검수 시작...');

        const result = await model.generateContent([
            { text: PROMPTS.CRITIC_NEWS.system },
            { text: userPrompt }
        ]);

        const response = await result.response;
        const text = response.text();

        return parseJsonSafe(text);

    } catch (error) {
        logger.error(`❌ Gemini 검수 실패: ${error.message}`);
        return newsJson; // 실패 시 원본이라도 반환 (Fallback)
    }
};

/**
 * JSON 파싱 헬퍼 함수 (Markdown 코드블록 제거)
 */
const parseJsonSafe = (text) => {
    try {
        // ```json ... ``` 제거
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // 혹시 모를 앞뒤 텍스트 제거 (대괄호 찾기)
        const firstBracket = cleanText.indexOf('[');
        const lastBracket = cleanText.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        }

        return JSON.parse(cleanText);
    } catch (e) {
        logger.error(`⚠️ JSON 파싱 에러 (Text: ${text.substring(0, 50)}...)`);
        throw new Error('AI 응답이 올바른 JSON 형식이 아닙니다.');
    }
};

module.exports = {
    analyzeNews,
    refineAnalysis,
};
