import { addIcon } from "@iconify/react";
import arrowRight from "@iconify-icons/mdi/arrow-right";
import bellOffOutline from "@iconify-icons/mdi/bell-off-outline";
import bellOutline from "@iconify-icons/mdi/bell-outline";
import bellRing from "@iconify-icons/mdi/bell-ring";
import cellphoneArrowDown from "@iconify-icons/mdi/cellphone-arrow-down";
import chevronDown from "@iconify-icons/mdi/chevron-down";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import close from "@iconify-icons/mdi/close";
import cloudCheckOutline from "@iconify-icons/mdi/cloud-check-outline";
import cloudOffOutline from "@iconify-icons/mdi/cloud-off-outline";
import flagCheckered from "@iconify-icons/mdi/flag-checkered";
import goKartTrack from "@iconify-icons/mdi/go-kart-track";
import home from "@iconify-icons/mdi/home";
import magnify from "@iconify-icons/mdi/magnify";
import monitor from "@iconify-icons/mdi/monitor";
import podium from "@iconify-icons/mdi/podium";
import racingHelmet from "@iconify-icons/mdi/racing-helmet";
import refresh from "@iconify-icons/mdi/refresh";
import shareVariant from "@iconify-icons/mdi/share-variant";
import trophy from "@iconify-icons/mdi/trophy";
import trophyOutline from "@iconify-icons/mdi/trophy-outline";
import weatherNight from "@iconify-icons/mdi/weather-night";
import whiteBalanceSunny from "@iconify-icons/mdi/white-balance-sunny";

// Shipped with the app rather than asked of the Iconify API when they show: they show offline too
// An icon missing here still shows online, fetched as before
const ICONS = {
	"arrow-right": arrowRight,
	"bell-off-outline": bellOffOutline,
	"bell-outline": bellOutline,
	"bell-ring": bellRing,
	"cellphone-arrow-down": cellphoneArrowDown,
	"chevron-down": chevronDown,
	"chevron-left": chevronLeft,
	"chevron-right": chevronRight,
	close,
	"cloud-check-outline": cloudCheckOutline,
	"cloud-off-outline": cloudOffOutline,
	"flag-checkered": flagCheckered,
	"go-kart-track": goKartTrack,
	home,
	magnify,
	monitor,
	podium,
	"racing-helmet": racingHelmet,
	refresh,
	"share-variant": shareVariant,
	trophy,
	"trophy-outline": trophyOutline,
	"weather-night": weatherNight,
	"white-balance-sunny": whiteBalanceSunny,
};

for (const [name, icon] of Object.entries(ICONS)) {
	addIcon(`mdi:${name}`, icon);
}
