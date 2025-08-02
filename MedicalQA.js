import React, { useState } from 'react';
import './MedicalQA.css'; // You'll need to create this CSS file

const MedicalQA = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const exampleQuestions = [
    "ผมปวดท้องมาก อ้วกด้วย ตอนนี้ตีสองยังมีแผนกไหนเปิดอยู่ไหมครับ?  ก. Endocrinology ข. Orthopedics ค. Emergency ง. Internal Medicine",
    "ยา Clopidogrel mg tablet ในปี 2567 จ่ายในอัตราเท่าใดต่อเม็ดในกรณีผู้ป่วยนอก (OP)?  ก. 2 บาท/เม็ด ข. 3 บาท/เม็ด ค. 4 บาท/เม็ด ง. 5 บาท/เม็ด",
    "ข้อใดต่อไปนี้เป็นอาการฉุกเฉินวิกฤตที่เข้าข่ายสิทธิ UCEP?  ก. เจ็บหน้าอกเฉียบพลันรุนแรง ข. ปวดหัวอย่างรุนแรง ค. มีไข้สูง ง. ปวดท้องเรื้อรัง",
    "สิทธิในข้อใดที่ไม่รวมอยู่ในสิทธิประโยชน์ของผู้มีสิทธิหลักประกันสุขภาพแห่งชาติ?  ก. สิทธิหลักประกันสุขภาพแห่งชาติ ข. สิทธิบัตรทอง ค. สิทธิ 30 บาทรักษาทุกโรค ง. ไม่มีข้อใดถูกต้อง",
    "ค่าบริการเคลือบฟลูออไรด์ชนิดเข้มข้นสูงเฉพาะที่มีอัตราเหมาจ่ายเท่าใดต่อครั้ง?  ก. 50 บาท ข. 75 บาท ค. 100 บาท ง. 150 บาท"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Add user question to chat
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    
    try {
      const response = await fetch('http://localhost:5000/eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `คำตอบ: ${data.answer}`,
        reason: data.reason
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'ขออภัย เกิดข้อผิดพลาดในการประมวลผลคำถาม',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const handleExampleClick = (example) => {
    setQuestion(example);
  };

  return (
    <div className="medical-qa-container">
      <h3>Medical Q&A</h3>
      <p className="description">ถามคำถามทางการแพทย์เพื่อรับคำตอบที่ถูกต้องจากระบบของเรา</p>
      
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>ถามคำถามทางการแพทย์ของคุณที่นี่</p>
              <div className="example-questions">
                <p>ตัวอย่างคำถาม:</p>
                <ul>
                  {exampleQuestions.map((q, index) => (
                    <li key={index} onClick={() => handleExampleClick(q)}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                  {msg.reason && (
                    <div className="reason">{msg.reason}</div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message bot">
              <div className="message-content loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="question-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="พิมพ์คำถามทางการแพทย์ของคุณ..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !question.trim()}>
            {isLoading ? 'กำลังประมวลผล...' : 'ส่งคำถาม'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalQA;