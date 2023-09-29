import localforage from 'localforage';
import uFuzzy from '@leeoniya/ufuzzy';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

let isSet = false;

export async function getLocalForage() {
    if (!isSet) {
        await localforage.defineDriver(syncDriver)
        localforage.setDriver('webExtensionSyncStorage')
        isSet = true
    }

    return localforage
}

interface SearchResult {
    item: { author: string, handle: string, text: string, thumbnailURL: string },
    matches: Array<{
        indices: [number, number][],
        key: string
    }>
}

export async function search(data: { author: string, handle: string, text: string, thumbnailURL: string }[], query: string): Promise<SearchResult[]> {
    const fuzzy = new uFuzzy({
        intraMode: 1,
        intraIns: 1,
        intraSub: 1,
        intraTrn: 1,
        intraDel: 1,
        interIns: 1,
    });
    
    const results: SearchResult[] = [];

    data.forEach(item => {
        const matches: SearchResult['matches'] = [];
        
        ['author', 'text'].forEach(key => {
            const searchResults = fuzzy.search([item[key]], query);
            if (!searchResults || searchResults[0] === null) return;
            
            const [idxs, info, order] = searchResults as [uFuzzy.HaystackIdxs, uFuzzy.Info, uFuzzy.InfoIdxOrder];
            
            order.forEach(orderIdx => {
                const idx = info.idx[orderIdx];
                const ranges = info.ranges[orderIdx] || [];
                
                ranges.forEach((range, rangeIdx) => {
                    if (rangeIdx % 2 === 0) {
                        const start = range;
                        const end = ranges[rangeIdx + 1];
                        matches.push({ indices: [[start, end-1]], key });
                    }
                });
            });
        });
        
        if (matches.length > 0) results.push({ item, matches });
    });

    return results;
}