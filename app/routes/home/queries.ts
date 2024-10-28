export async function getHomeData(userId: string) {
  console.log(userId, ">>>>>>>>>>>>>>>>>>>>");

  return [userId]
}

export async function deleteBoard(boardId: number, accountId: string) {
  return ({
    where: { id: boardId, accountId },
  });
}

export async function createBoard(userId: string, name: string, color: string) {
  return ({
    id: 2
  });
}