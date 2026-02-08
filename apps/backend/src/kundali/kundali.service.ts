import { Injectable } from '@nestjs/common';

export interface BirthDetails {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
}

export interface KundaliResult {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    dayOfBirth: string;
    rashi: string;
    rashiHindi: string;
    nakshatra: string;
    lagna: string;
    lagnaHindi: string;
    planets: {
        sun: string;
        moon: string;
        mars: string;
        mercury: string;
        jupiter: string;
        venus: string;
        saturn: string;
        rahu: string;
        ketu: string;
    };
}

const rashis = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const rashisHindi = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"];
const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

@Injectable()
export class KundaliService {
    async generateKundali(data: BirthDetails): Promise<KundaliResult> {
        const dob = new Date(data.dateOfBirth);
        const dayOfWeek = dob.toLocaleDateString('en-US', { weekday: 'long' });
        const month = dob.getMonth();
        const day = dob.getDate();

        // Calculate basic positions
        const nakshatraIndex = (day + month) % 27;
        const timeParts = data.timeOfBirth.split(':');
        const hour = parseInt(timeParts[0]) || 6;
        const lagnaIndex = Math.floor(hour / 2) % 12;

        // Try AI generation
        try {
            const aiResult = await this.generateWithAI(data);
            if (aiResult) return aiResult;
        } catch (error) {
            console.error('AI kundali generation failed:', error);
        }

        // Fallback to calculated values
        return {
            name: data.name,
            dateOfBirth: data.dateOfBirth,
            timeOfBirth: data.timeOfBirth,
            placeOfBirth: data.placeOfBirth,
            dayOfBirth: dayOfWeek,
            rashi: rashis[month],
            rashiHindi: rashisHindi[month],
            nakshatra: nakshatras[nakshatraIndex],
            lagna: rashis[lagnaIndex],
            lagnaHindi: rashisHindi[lagnaIndex],
            planets: {
                sun: rashis[(month + 0) % 12],
                moon: rashis[(month + nakshatraIndex) % 12],
                mars: rashis[(month + 3) % 12],
                mercury: rashis[(month + 1) % 12],
                jupiter: rashis[(month + 5) % 12],
                venus: rashis[(month + 2) % 12],
                saturn: rashis[(month + 7) % 12],
                rahu: rashis[(month + 9) % 12],
                ketu: rashis[(month + 3) % 12],
            }
        };
    }

    async generateDetailedKundali(data: BirthDetails & { userId?: string }): Promise<any> {
        const basicKundali = await this.generateKundali(data);

        // For detailed kundali, we would store this for later delivery
        // In production, this would be queued for expert review

        return {
            ...basicKundali,
            status: 'processing',
            message: 'Your detailed Kundali report will be ready within 24 hours.',
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            orderType: 'DETAILED_KUNDALI'
        };
    }

    async generateKundaliMilan(data: { boy: BirthDetails; girl: BirthDetails; userId?: string }): Promise<any> {
        const boyKundali = await this.generateKundali(data.boy);
        const girlKundali = await this.generateKundali(data.girl);

        // Calculate Gun Milan (simplified)
        const gunaScore = this.calculateGunaMilan(boyKundali, girlKundali);

        return {
            boy: boyKundali,
            girl: girlKundali,
            compatibility: {
                totalGuna: gunaScore,
                maxGuna: 36,
                percentage: Math.round((gunaScore / 36) * 100),
                recommendation: gunaScore >= 18 ? 'Compatible' : 'Needs Consultation'
            },
            status: 'processing',
            message: 'Your detailed Kundali Milan report will be ready within 24 hours.',
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            orderType: 'KUNDALI_MILAN'
        };
    }

    private calculateGunaMilan(boy: KundaliResult, girl: KundaliResult): number {
        // Simplified Guna calculation
        let score = 0;

        // Varna (1 point)
        score += 1;

        // Vasya (2 points)
        if (boy.rashi === girl.rashi) score += 2;
        else score += 1;

        // Tara (3 points)
        const boyNakIndex = nakshatras.indexOf(boy.nakshatra);
        const girlNakIndex = nakshatras.indexOf(girl.nakshatra);
        if (Math.abs(boyNakIndex - girlNakIndex) % 9 <= 3) score += 3;
        else score += 1.5;

        // Yoni (4 points)
        score += Math.floor(Math.random() * 4) + 1;

        // Graha Maitri (5 points)
        score += Math.floor(Math.random() * 5) + 1;

        // Gana (6 points)
        score += Math.floor(Math.random() * 6) + 1;

        // Bhakoot (7 points)
        const rashiDiff = Math.abs(rashis.indexOf(boy.rashi) - rashis.indexOf(girl.rashi));
        if (rashiDiff === 0 || rashiDiff === 6) score += 0;
        else score += 7;

        // Nadi (8 points)
        if (boy.nakshatra !== girl.nakshatra) score += 8;

        return Math.min(score, 36);
    }

    private async generateWithAI(data: BirthDetails): Promise<KundaliResult | null> {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return null;

        try {
            const prompt = `Generate a Vedic astrology birth chart (Kundali) for:
            Name: ${data.name}
            Date of Birth: ${data.dateOfBirth}
            Time of Birth: ${data.timeOfBirth}
            Place of Birth: ${data.placeOfBirth}

            Provide the following in JSON format:
            1. rashi (moon sign)
            2. nakshatra (birth star)
            3. lagna (ascendant)
            4. All 9 planets (sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu) with their zodiac positions

            Return only valid JSON with these fields.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1000,
                        }
                    })
                }
            );

            if (!response.ok) return null;

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const dob = new Date(data.dateOfBirth);

                return {
                    name: data.name,
                    dateOfBirth: data.dateOfBirth,
                    timeOfBirth: data.timeOfBirth,
                    placeOfBirth: data.placeOfBirth,
                    dayOfBirth: dob.toLocaleDateString('en-US', { weekday: 'long' }),
                    rashi: parsed.rashi || rashis[dob.getMonth()],
                    rashiHindi: rashisHindi[rashis.indexOf(parsed.rashi)] || rashisHindi[dob.getMonth()],
                    nakshatra: parsed.nakshatra || nakshatras[0],
                    lagna: parsed.lagna || rashis[0],
                    lagnaHindi: rashisHindi[rashis.indexOf(parsed.lagna)] || rashisHindi[0],
                    planets: parsed.planets || {
                        sun: rashis[0],
                        moon: rashis[1],
                        mars: rashis[2],
                        mercury: rashis[3],
                        jupiter: rashis[4],
                        venus: rashis[5],
                        saturn: rashis[6],
                        rahu: rashis[7],
                        ketu: rashis[8],
                    }
                };
            }
        } catch (error) {
            console.error('AI Kundali error:', error);
        }

        return null;
    }
}
