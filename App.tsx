import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import Main from "./navigations/MainTab";
import Auth from "./navigations/AuthStack";
import * as SecureStore from "expo-secure-store";
import { login } from "./lib/api/auth";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "./modules/AuthContext";
import { Alert } from "react-native";

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SET_TOKEN":
          return {
            ...prevState,
            token: action.token,
          };
      }
    },
    {
      // isLoading: true,
      token: null,
      loginFailed: false,
    }
  );

  const authMethods = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        try {
          // 로그인 요청 해서 토큰 받기
          const res = await login(email, password);
          const token = res.token;
          // 비밀 저장소에 토큰 저장
          await SecureStore.setItemAsync("access_token", token);
          // state의 토큰 변경
          dispatch({ type: "SET_TOKEN", token });
        } catch (err) {
          // 로그인 실패 시
          // console.log(err);
          if (err.response.status != 500) {
            Alert.alert(null, err.response.data.message);
          } else {
            Alert.alert(
              null,
              "예상치 못한 문제가 발생했습니다. 다음에 다시 시도해주세요"
            );
          }
        }
      },
      signUp: async (email: string, password: string, nickname: string) => {},
    }),
    []
  );

  // 앱 시작 시 secure store에 토큰 있는 지 확인
  useEffect(() => {
    const get_saved_token = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        dispatch({ type: "SET_TOKEN", token });
      } catch (e) {
        // 저장된 토큰이 없을 시
      }
    };
    get_saved_token();
    return () => {
      // 앱 종료 시 state에서 토큰 제거
      dispatch({ type: "SET_TOKEN", token: null });
    };
  }, []);

  return (
    <AuthContext.Provider value={authMethods}>
      <NavigationContainer>
        {state.token == null ? <Auth /> : <Main />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
