import crypto from "crypto";

class Password {
  private static instance: Password;
  private secret: string;

  private constructor() {
    this.secret = process.env.PASSWORD_SECRET || "default_secret";
  }

  static getInstance(): Password {
    if (!Password.instance) {
      Password.instance = new Password();
    }
    return Password.instance;
  }

  hashPassword(password: string): string {
    const hash = crypto.createHmac("sha256", this.secret);
    hash.update(password);
    return hash.digest("hex");
  }

  comparePasswords(password: string, hashedPassword: string): boolean {
    const hashedInput = this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
}

export default Password.getInstance();
