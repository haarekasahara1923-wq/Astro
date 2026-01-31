import { Injectable } from '@nestjs/common';

interface RashiData {
    name: string;
    nameHindi: string;
    symbol: string;
    dateRange: string;
    prediction: string;
    luckyColor: string;
    luckyNumber: string;
}

const rashiList = [
    { name: "Aries", nameHindi: "मेष", symbol: "♈", dateRange: "Mar 21 - Apr 19" },
    { name: "Taurus", nameHindi: "वृषभ", symbol: "♉", dateRange: "Apr 20 - May 20" },
    { name: "Gemini", nameHindi: "मिथुन", symbol: "♊", dateRange: "May 21 - Jun 20" },
    { name: "Cancer", nameHindi: "कर्क", symbol: "♋", dateRange: "Jun 21 - Jul 22" },
    { name: "Leo", nameHindi: "सिंह", symbol: "♌", dateRange: "Jul 23 - Aug 22" },
    { name: "Virgo", nameHindi: "कन्या", symbol: "♍", dateRange: "Aug 23 - Sep 22" },
    { name: "Libra", nameHindi: "तुला", symbol: "♎", dateRange: "Sep 23 - Oct 22" },
    { name: "Scorpio", nameHindi: "वृश्चिक", symbol: "♏", dateRange: "Oct 23 - Nov 21" },
    { name: "Sagittarius", nameHindi: "धनु", symbol: "♐", dateRange: "Nov 22 - Dec 21" },
    { name: "Capricorn", nameHindi: "मकर", symbol: "♑", dateRange: "Dec 22 - Jan 19" },
    { name: "Aquarius", nameHindi: "कुम्भ", symbol: "♒", dateRange: "Jan 20 - Feb 18" },
    { name: "Pisces", nameHindi: "मीन", symbol: "♓", dateRange: "Feb 19 - Mar 20" },
];

@Injectable()
export class HoroscopeService {
    private cachedHoroscopes: RashiData[] = [];
    private lastGeneratedDate: string = '';

    async getDailyHoroscope(): Promise<RashiData[]> {
        const today = new Date().toISOString().split('T')[0];

        // Return cached if same day
        if (this.lastGeneratedDate === today && this.cachedHoroscopes.length > 0) {
            return this.cachedHoroscopes;
        }

        // Try to generate with AI, fallback to local
        try {
            const horoscopes = await this.generateWithAI();
            if (horoscopes && horoscopes.length > 0) {
                this.cachedHoroscopes = horoscopes;
                this.lastGeneratedDate = today;
                return horoscopes;
            }
        } catch (error) {
            console.error('AI generation failed, using local:', error);
        }

        // Fallback to local generation
        return this.generateLocalHoroscopes();
    }

    async regenerateHoroscope(): Promise<{ success: boolean }> {
        this.lastGeneratedDate = '';
        await this.getDailyHoroscope();
        return { success: true };
    }

    private async generateWithAI(): Promise<RashiData[]> {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return this.generateLocalHoroscopes();
        }

        try {
            const prompt = `Generate daily horoscope predictions for all 12 zodiac signs for today. 
            For each sign provide:
            1. A 2-3 sentence prediction covering love, career, and health
            2. Lucky color
            3. Lucky number (1-9)
            
            Format as JSON array with objects having: name, prediction, luckyColor, luckyNumber
            Signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2000,
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Gemini API error');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Parse JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const predictions = JSON.parse(jsonMatch[0]);
                return rashiList.map((rashi, index) => ({
                    ...rashi,
                    prediction: predictions[index]?.prediction || this.getDefaultPrediction(index),
                    luckyColor: predictions[index]?.luckyColor || this.getDefaultColor(index),
                    luckyNumber: String(predictions[index]?.luckyNumber || ((index % 9) + 1))
                }));
            }
        } catch (error) {
            console.error('Gemini API error:', error);
        }

        return this.generateLocalHoroscopes();
    }

    private generateLocalHoroscopes(): RashiData[] {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

        return rashiList.map((rashi, index) => ({
            ...rashi,
            prediction: this.getDefaultPrediction((index + dayOfYear) % 12),
            luckyColor: this.getDefaultColor((index + dayOfYear) % 10),
            luckyNumber: String(((index + 1 + dayOfYear) % 9) + 1)
        }));
    }

    private getDefaultPrediction(index: number): string {
        const predictions = [
            "Today brings positive energy for new beginnings. Your hard work will yield excellent results. Focus on personal growth and self-improvement.",
            "Financial opportunities are on the horizon. Be careful with investments and trust your intuition. A loved one may need your support today.",
            "Communication is key today. Express your feelings openly and honestly. Career advancement is possible if you stay focused.",
            "Health should be your priority today. Take time for meditation and self-care. Unexpected good news may arrive by evening.",
            "Romance is in the air. Single individuals may meet someone special. Married couples should plan quality time together.",
            "Professional life takes center stage. A challenging project will test your skills, but success is within reach. Stay confident.",
            "Travel plans may materialize. Family relationships need attention. Be flexible and open to changes in your routine.",
            "Creative energy flows freely today. Artists and writers will find inspiration. Financial matters look stable.",
            "Social connections bring joy. Networking opportunities abound. Don't hesitate to ask for help when needed.",
            "Inner peace is achievable today. Spiritual pursuits will bring clarity. Avoid conflicts and maintain harmony.",
            "Education and learning are favored. Students will excel in studies. Teachers will find satisfaction in their work.",
            "Property matters may need attention. Home improvements are well-starred. Spend quality time with family.",
        ];
        return predictions[index % predictions.length];
    }

    private getDefaultColor(index: number): string {
        const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "White", "Gold", "Silver"];
        return colors[index % colors.length];
    }
}
