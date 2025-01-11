import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../prisma/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = JSON.parse(req.body);
    const user = await db.user.findUnique({ where: { email } });
    res.status(200).json({ exists: !!user });
  } else {
    res.status(405).end(); 
  }
}
