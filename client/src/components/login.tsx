import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { IUserInfo } from "../App";


interface ILoginProps {
    authenticateError: string;
    authenticateUser: Function;
}

export default function Login({authenticateError, authenticateUser}: ILoginProps) {

  const [name, setName] = useState<string>('');

  function onNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authenticateUser(name);
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 h-96 bg-blue-400 rounded-md">
        <form className="flex flex-col gap-6 justify-center items-center h-full" onSubmit={(event) => onNameSubmit(event)}>
          <label htmlFor="name" className="text-white">
            Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border w-48 rounded-md h-10 border-white focus:outline-none p-3 text-white"
          />
          <button type="submit" className="text-white border border-white h-12 w-48 rounded-md hover:bg-white hover:text-blue-400">Submit</button>
          {
            authenticateError && <div className="text-red-700">{authenticateError}</div>
            }
        </form>
      </div>
    </div>
  );
}
