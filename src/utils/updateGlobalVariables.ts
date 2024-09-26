import { OHLCVT } from "../types";

export function updateGlobalVariables(data: OHLCVT, currentChunks: OHLCVT[], currentChunkCount:number){
    const updatedchunks = [...currentChunks, data];
    const updatedCount = currentChunkCount + 1;
    return {chunks: updatedchunks, count: updatedCount};
}