import { OHLCVT } from '../../types';

export function updateGlobalVariables(
  data: OHLCVT,
  currentChunks: OHLCVT[],
  currentChunkCount: number,
  totalCount: number
) {
  const updatedchunks = [...currentChunks, data];
  const updatedCount = currentChunkCount + 1;
  const updatedTotalcount = totalCount + 1;
  return {
    chunks: updatedchunks,
    count: updatedCount,
    total: updatedTotalcount,
  };
}
