import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import config from "../../config.json";

export const Login = () => {
  const navigate = useNavigate();

  const [link, setLink] = useState<File | null>(null);
  const [err, setErr] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const firstFile = e.target?.files?.item(0);
    if (firstFile) {
      setLink(firstFile);
    } else {
      setErr(true);
      setLink(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (!link || link === null) {
      setErr(true);
    } else {
      const formData = new FormData(event.currentTarget);
      console.log("Submitting", formData);
      fetch(config.server_url + "/submitdb", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          navigate("/dashboard");
          console.log(data);
          // Handle successful response here
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          // Handle error here
        });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-primary h-[100vh]">
        <MdProductionQuantityLimits className="text-secondary w-8 h-8" />
        <p className="font-[700] lg:text-[19px] text-white cursor-pointer">
          Product Sentiment
        </p>{" "}
        <form
          onSubmit={handleSubmit}
          className="flex justify-center lg:items-center items-start mx-[40px] flex-col gap-6 text-textAsh mt-[20px] w-[80%] lg:w-[50%]"
        >
          <div className="pb-4 w-full text-black font-[700]">
            <FormControl>
              <FormLabel fontWeight={"700"} fontSize={"16px"} color="white">
                Enter Database File
              </FormLabel>
              <Input
                name="database"
                size="md"
                type={"file"}
                bg={"white"}
                onChange={handleFileChange}
                fontWeight={"400"}
                rounded={"xl"}
                fontSize={"15px"}
                outline={"none"}
                border={"none"}
                accept="*"
              />
              {err && link === null ? (
                <p className="text-red-400">Please enter a json file</p>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <Button
            type="submit"
            className={`w-full py-2 px-6 mt-2 md:mt-0 md:px-9 bg-red text-white rounded-md`}
            bg="#239463"
          >
            SUBMIT
          </Button>
        </form>
      </div>
    </>
  );
};
