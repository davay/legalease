
const BASE_URL = import.meta.env.VITE_API_URL as string;

const api = {
  async createChat(): Promise<number> {
    const res = await fetch(BASE_URL + `/chat`)
    const data = await res.json();
    if (!res.ok) {
      return Promise.reject({ status: res.status, data });
    }
    console.log(data)
    return data;
  },

  async sendChatMessage(session_id: number | null, message: string, ): Promise<Response["body"]> {
    const res = await fetch(BASE_URL + `/chat/` + session_id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      return Promise.reject({ status: res.status, data: await res.json() });
    }
    return res.body;
  },
  async summarize(
    session_id: number | null
  ): Promise<Response["body"]> {
    const res = await fetch(`${BASE_URL}/summarize/${session_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      return Promise.reject({ status: res.status, data: await res.json() });
    }
    return res.body; 
  },
  async draft_articles(
    session_id: number | null
  ): Promise<Response["body"]> {
    const res = await fetch(`${BASE_URL}/draft/${session_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      return Promise.reject({ status: res.status, data: await res.json() });
    }
    return res.body; 
  },
  async generate_next_steps(
    session_id: number | null
  ): Promise<Response["body"]> {
    const res = await fetch(`${BASE_URL}/generate_next_steps/${session_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      return Promise.reject({ status: res.status, data: await res.json() });
    }
    return res.body; 
  }


};

export default api;
