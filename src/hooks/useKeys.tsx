import { SorobanContextType, useSorobanReact } from "@soroban-react/core";
import useSWR from "swr";
import { AdminKeyResponseType, KeysType } from "../interfaces";
import { useMemo } from "react";
// TODO: verify type of fetcher args
const fetcher = (...args: [any, any]) => fetch(...args).then((resp) => resp.json());

// export const useKeys = () => {
//   const sorobanContext = useSorobanReact()
export const useKeys = (sorobanContext: SorobanContextType) => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keys`,
    fetcher,
  );
  console.log("useKeys rendered")

  const filtered = useMemo(() => {
    console.log("filtered rendered")
    return data?.filter(
      (item: AdminKeyResponseType) =>
        item.network === sorobanContext?.activeChain?.name?.toLowerCase(),
    );
  }, [data, sorobanContext?.activeChain?.name])

  return useMemo(() => {
    console.log("memo keys rendered")

    let keys: KeysType = { admin_public: "", admin_secret: "" };
    if (filtered?.length > 0) {
      keys = {
        admin_public: filtered[0].admin_public,
        admin_secret: filtered[0].admin_secret,
      };
    }

    return keys;
  }, [filtered])

  // return useMemo(() => {

  //   let keys: KeysType = { admin_public: "", admin_secret: "" };

  //   const filtered = data?.filter(
  //     (item: AdminKeyResponseType) =>
  //       item.network === sorobanContext?.activeChain?.name?.toLowerCase(),
  //   );

  //   if (filtered?.length > 0) {
  //     keys = {
  //       admin_public: filtered[0].admin_public,
  //       admin_secret: filtered[0].admin_secret,
  //     };
  //   }

  //   return keys;
  // }, [data, sorobanContext])
};
