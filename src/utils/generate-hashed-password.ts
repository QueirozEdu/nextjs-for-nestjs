import { hashPassword } from "@/lib/login/manage-login";

(async () => {
    const myPassword = "123456"; //DO NOT FORGET TO DELETE YOUR PASSWORD
    const hashedPasswordInBase64 = await hashPassword(myPassword);

    console.log({ hashedPasswordInBase64 });
})();
