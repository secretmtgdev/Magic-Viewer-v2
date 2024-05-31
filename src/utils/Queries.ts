import { EMPTY_CARD_RESPONSE, SCRYFALL_ENDPOINTS } from './ApiConstants';
import { ClientLib, ScryfallLib } from './Types';
import { getFullQueryEndpoint } from './Utils';

const getColorQuery = (colors: string[]) => colors.reduce((prevColor, curColor) => prevColor + curColor);
const getCardsByQuery = async (epQuery: string): Promise<[ScryfallLib.ICard[], string]> => {
    let query = `${getFullQueryEndpoint(SCRYFALL_ENDPOINTS.search)}?q=${epQuery}`;
    return await getCardsByEndpoint(query);
}

export const getCardsByEndpoint = async (endPoint: string): Promise<[ScryfallLib.ICard[], string]> => {
    let cards: ScryfallLib.ICard[] = [];
    const cardResponse = await fetch(endPoint)
        .then(res => {
            if (res.status >= 400) {
                throw new Error(res.statusText);
            }            
            return res.json()
        })        
        .then((res: ScryfallLib.ICardResponse) => res)
        .catch(() => {
            // TODO: Create a component to inform the user that no cards are available
            return EMPTY_CARD_RESPONSE;
        });
    cards = [...cards, ...cardResponse.data as ScryfallLib.ICard[]];
    return [cards, cardResponse.next_page];
}

export const getCardsByFilters = async (filters: ClientLib.IAllFilters) => {
    let curQuery = [];
    if (filters.colorCombinations && filters.colorCombinations.colors!.length > 0) {
        curQuery.push(`c${filters.colorCombinations.areSingle && !filters.colorCombinations.noOtherColors ? ':' : '='}${getColorQuery(filters.colorCombinations.colors)}`);
    }

    if (filters.priceRange) {
        curQuery.push(`+usd>=${filters.priceRange.minPrice}`);
        if (filters.priceRange.maxPrice !== Infinity) {
            curQuery.push(`+usd<=${filters.priceRange.maxPrice}`);
        }
    }

    if (!!filters.textFilter) {
        curQuery.push(filters!.textFilter);
    }

    if (filters.cardTypeSelection && filters.cardTypeSelection.length > 0) {
        curQuery.push(`t:/${filters.cardTypeSelection.join('|')}{1,}/`)
    }

    return await getCardsByQuery(curQuery.join(''));
}

export const getCardsByColors = async (colors: string[]) => {
    if (!colors || colors.length === 0) {
        return;
    }

    const colorQuery = getColorQuery(colors);
    let epQuery = `${getFullQueryEndpoint(SCRYFALL_ENDPOINTS.search)}?q=c:${colorQuery}`;
    let [cards, nextPage]: [ScryfallLib.ICard[], string] = await getCardsByQuery(epQuery);
    return [cards, nextPage];
}

export const getCardsByCardType = () => {}
export const getCardsByText = () => {}
export const getCardsByManaCost = () => {}
export const getCardsByPower = () => {}
export const getCardsByToughness = () => {}
export const getCardsByRarity = () => {}
export const getCardBySet = () => {}