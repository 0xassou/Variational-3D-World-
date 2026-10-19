/**
 * Instantané des métriques Variational, affiché tant que les données live ne sont pas chargées
 * (ou si les API publiques sont injoignables).
 * Sources : API publique Variational (…/metadata/stats) et DefiLlama
 * (/summary/open-interest/variational, un point par semaine). Relevé du 2026-10-19.
 */
import type { MetricsData } from './metrics';

export const METRICS_SNAPSHOT: MetricsData = {
  "fetchedAt": "2026-10-19T21:59:10Z",
  "volume24h": 3045328835,
  "cumulativeVolume": 423651060224,
  "tvl": 240465676,
  "openInterest": 1950991455,
  "numMarkets": 576,
  "rwaMarkets": 135,
  "rwaVolumeShare": 0.7147,
  "topMarkets": [
    {
      "ticker": "US100S",
      "name": "Swap on US Non-Financial 100",
      "volume24h": 1002254077,
      "openInterest": 74185017,
      "rwa": true
    },
    {
      "ticker": "BTC",
      "name": "Bitcoin",
      "volume24h": 432112079,
      "openInterest": 193721746,
      "rwa": false
    },
    {
      "ticker": "US30S",
      "name": "Swap on US30 Spot",
      "volume24h": 317597982,
      "openInterest": 7991830,
      "rwa": true
    },
    {
      "ticker": "US500S",
      "name": "Swap on US 500",
      "volume24h": 297475722,
      "openInterest": 31610650,
      "rwa": true
    },
    {
      "ticker": "ETH",
      "name": "Ethereum",
      "volume24h": 266212946,
      "openInterest": 127662371,
      "rwa": false
    },
    {
      "ticker": "XAUS",
      "name": "Swap on Gold Spot",
      "volume24h": 199914807,
      "openInterest": 46557339,
      "rwa": true
    },
    {
      "ticker": "XAGS",
      "name": "Swap on Silver Spot",
      "volume24h": 75037809,
      "openInterest": 9884753,
      "rwa": true
    },
    {
      "ticker": "DXIP",
      "name": "Swap on Dollar Index",
      "volume24h": 47168775,
      "openInterest": 6145286,
      "rwa": true
    },
    {
      "ticker": "HYPE",
      "name": "Hyperliquid",
      "volume24h": 31828059,
      "openInterest": 23815365,
      "rwa": false
    },
    {
      "ticker": "US2KS",
      "name": "Swap on US2K Spot",
      "volume24h": 31805158,
      "openInterest": 2558704,
      "rwa": true
    }
  ],
  "openInterestHistory": [
    [1767484800, 429699230],
    [1768089600, 590181671],
    [1768694400, 568426942],
    [1769299200, 502565548],
    [1769904000, 367062105],
    [1770508800, 305640873],
    [1771113600, 318266171],
    [1771718400, 356319464],
    [1772323200, 355061116],
    [1772928000, 330347560],
    [1773532800, 439974473],
    [1774137600, 354557357],
    [1774742400, 335877392],
    [1775347200, 325813279],
    [1775952000, 327542002],
    [1776556800, 301087941],
    [1777161600, 345733059],
    [1777766400, 352899001],
    [1778371200, 395973143],
    [1778976000, 365095174],
    [1779580800, 481986372],
    [1780185600, 540923326],
    [1780790400, 423118380],
    [1781395200, 466588337],
    [1782000000, 531150734],
    [1782604800, 511404809],
    [1783209600, 588020667],
    [1783814400, 640980128],
    [1784419200, 669844758],
    [1785024000, 684812992],
    [1785628800, 648290853],
    [1786233600, 721132623],
    [1786838400, 758675716],
    [1787443200, 714585080],
    [1788048000, 707367389],
    [1788652800, 876281510],
    [1789257600, 801178571],
    [1789862400, 913756101],
    [1790467200, 1030383397],
    [1791072000, 1108294272],
    [1791676800, 1088267402],
    [1792281600, 979551495],
    [1792368000, 969958845]
  ]
};
