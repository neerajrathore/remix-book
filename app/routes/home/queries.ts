import { prisma } from "~/db/prisma";

export async function getHomeData(userId: string) {
  // getting all boards
  return prisma.board.findMany({
    where: { accountId: userId }
  })
}

export async function deleteBoard(boardId: number, accountId: string) {
  return prisma.board.delete ({
    where: { id: boardId, accountId },
  });
}

export async function createBoard(userId: string, name: string, color: string) {
  return prisma.board.create({
    data: {
      name,
      color,
      Account: {
        connect: {
          id: userId
        }
      }
    }
  })
}