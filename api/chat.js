export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Thiếu nội dung câu hỏi.' });
    }

    const prompt =
      "Bạn là trợ lý học tập môn Ngữ văn. " +
      "Hãy trả lời rõ ràng, dễ hiểu, đúng trọng tâm, văn phong tự nhiên. " +
      "Nếu người dùng yêu cầu dàn ý, hãy trình bày mạch lạc theo ý lớn và ý nhỏ. " +
      "Nếu người dùng yêu cầu phân tích, hãy nêu nội dung và nghệ thuật ngắn gọn nhưng đủ ý.\n\n" +
      "Yêu cầu của người dùng: " + message;

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  }
);
    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Lỗi khi gọi Gemini API.'
      });
    }

    if (!text) {
      return res.status(500).json({
        error: 'Không nhận được phản hồi từ Gemini.'
      });
    }

    return res.status(200).json({ reply: text });
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi hệ thống: ' + error.message
    });
  }
}
