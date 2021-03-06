import client from "./client";

export const changeMyInfo = async (myInfo) => {
  try {
    const formData = new FormData();
    formData.append("nickname", myInfo.nickname);
    formData.append("message", myInfo.message);
    formData.append("thumbnail", myInfo.thumbnail);
    return client.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getMyInfo = () => client.get("/users/me");

// 내 작품 받아오기
// ?page=x
export const getMyPortfolios = (page: number) =>
  client.get(`/users/me/portfolios?page=${page}`);

// 내가 올린 튜토리얼 받아오기
// ?page=x
export const getMyTutorials = (page: number) =>
  client.get(`/users/me/tutorials?page=${page}`);
