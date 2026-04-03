-- ═══════════════════════════════════════════════════════════════════
-- Sidekick Prompt Library — Seed Data
-- Migrated from index.html (54 prompts: 27 Convert + 27 Shopify)
--
-- Inferred metadata assumptions:
-- - use_cases: derived from category and prompt content
-- - data_sources: Convert prompts → Shopify Analytics + GA4
--                 Shopify prompts → Shopify Analytics + Shopify Reports
-- - level: beginner = straightforward analysis
--           intermediate = multi-step or cross-platform
--           advanced = statistical, forecasting, or complex modelling
-- - when_to_use: derived from short_description + category context
-- - visibility: all seeded prompts → 'internal'
-- - is_recommended: first 5 Convert prompts marked recommended
-- - is_featured: flagship prompts from each category
-- ═══════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- CONVERT DIGITAL PROMPTS (27)
-- ────────────────────────────────────────────────────────────────

INSERT INTO prompts (slug, title, short_description, prompt_body, category, use_cases, data_sources, level, visibility, status, when_to_use, source_label, is_featured, is_recommended, version, published_at)
VALUES

($slug$executive-performance-summary$slug$,
 'Executive Performance Summary',
 'Top-line KPI summary with the biggest commercial and UX opportunities identified.',
 $body$Act as my senior Shopify conversion and UX audit analyst.

Analyse my Shopify store's performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. If a requested metric or breakdown is unavailable, clearly state that and suggest what should be validated in GA4. Where possible, reference specific products, collections, devices, or traffic sources by name. Keep the output concise, commercially useful, and suitable for a client UX audit.

Highlight the following KPIs:
- Sessions
- Conversion rate
- Orders
- Total sales
- Average order value
- Returning customer rate, if available
- Add to cart rate, if available
- Reached checkout rate, if available
- Checkout completion or abandonment rate, if available

Then identify:
- The top 3 positive performance shifts
- The top 3 negative performance shifts
- The top 3 commercial or UX opportunities suggested by the data

Output format:
1. Executive summary
2. KPI comparison table
3. Top positive changes
4. Top negative changes
5. Priority opportunities$body$,
 'CRO',
 ARRAY['monthly-reporting', 'client-presentation', 'post-launch'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'Use at the start of a CRO audit or monthly review. Ideal for building a client-facing summary that flags the most impactful opportunities without overwhelming detail.',
 'Convert',
 TRUE, TRUE, 1, NOW()),

($slug$funnel-and-checkout-performance$slug$,
 'Funnel and Checkout Performance',
 'Understand where users drop out of the funnel and which checkout segments are underperforming.',
 $body$Act as my Shopify conversion optimisation specialist.

Analyse my store's purchase funnel for {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. If a metric is unavailable, clearly state that and suggest GA4 validation. Reference specific products, collections, devices, or traffic sources by name. Keep the output suitable for a client UX audit.

Step 1: Funnel review
Map the funnel stages across:
- Product view → Add to cart → Reached checkout → Completed purchase

For each stage: total volume, conversion rate to next stage, drop-off volume and percentage.

Step 2: Breakdown analysis
Break down funnel performance by:
- Device type, traffic source or referrer, new vs returning, geography, product or collection, discount usage, cart value band

Step 3: Checkout focus
Identify:
- Segments with the weakest checkout completion rate
- Patterns linked to discount use, basket value, products, or customer type
- Likely indicators of shipping, payment, or trust friction

Step 4: Findings and hypotheses
Separate all conclusions into:
- Confirmed by Shopify data
- Likely hypothesis
- Requires GA4 or behavioural tool validation

Step 5: Recommendations
Recommend 5–7 targeted actions to improve funnel progression and checkout completion. For each: what to change, why it matters, expected impact, priority, suggested owner.

Output format:
1. Funnel summary
2. Funnel stage table
3. Segment breakdown insights
4. Checkout-specific findings
5. Confirmed findings vs hypotheses
6. Prioritised actions$body$,
 'CRO',
 ARRAY['post-launch', 'issue-investigation', 'monthly-reporting'],
 ARRAY['Shopify Analytics', 'GA4'],
 'advanced',
 'internal',
 'published',
 'When checkout abandonment is high or you need to identify where in the purchase funnel you are losing customers. Essential for CRO audits.',
 'Convert',
 TRUE, TRUE, 1, NOW()),

($slug$product-and-merchandising-performance$slug$,
 'Product and Merchandising Performance',
 'Find PDP, assortment, pricing, and collection-level performance issues.',
 $body$Act as my Shopify merchandising and conversion analyst.

Analyse product and collection performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. If a metric is unavailable, flag it for GA4 validation. Reference specific products and collections by name.

Identify:
- Top products by revenue and by units sold
- High-traffic but low-converting products, if available
- Products with strong interest but weak purchase completion
- Low-performing collections or product groups
- Signs of pricing, promotion, stock, or assortment issues affecting performance

Break findings down where possible by: device type, traffic source, new vs returning, discount usage.

Then infer the most likely UX or merchandising issues such as:
- Weak PDP clarity, poor imagery, price sensitivity, low product relevance, weak discovery, ineffective merchandising structure

Label each point as: Confirmed by Shopify data / Likely hypothesis / Requires GA4 validation.

Output format:
1. Product performance summary
2. Top and bottom product insights
3. Collection or category findings
4. Likely merchandising and UX issues
5. Prioritised recommendations$body$,
 'CRO',
 ARRAY['post-launch', 'issue-investigation', 'opportunity-discovery'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When analysing which products are underperforming relative to their traffic, or when reviewing the effectiveness of your current merchandising and collection structure.',
 'Convert',
 FALSE, TRUE, 1, NOW()),

($slug$device-and-channel-efficiency$slug$,
 'Device and Channel Efficiency',
 'Compare performance by device and channel before merging with GA4 acquisition analysis.',
 $body$Act as my Shopify conversion performance analyst.

Analyse performance over {{TF}} by device and traffic source, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. Reference specific devices and sources by name.

Break down where available by: mobile, desktop, tablet, and traffic source or referrer.

For each segment review: sessions, conversion rate, orders, revenue, AOV, reached checkout rate and checkout completion rate where available.

Identify:
- Which devices are least efficient
- Which traffic sources bring the strongest conversion quality
- Which bring volume but weak conversion
- Combinations of device and traffic source that are especially weak or strong

Infer likely causes such as: mobile UX friction, poor landing page alignment, low-intent paid traffic, weak merchandising for certain acquisition types.

Label conclusions as: Confirmed / Likely hypothesis / Requires GA4 validation.

Output format:
1. Device and channel summary
2. Performance table
3. Weakest and strongest segments
4. Likely causes
5. Prioritised actions$body$,
 'CRO',
 ARRAY['post-launch', 'issue-investigation', 'weekly-review'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When you suspect mobile or a specific traffic source is underperforming, or when preparing recommendations to improve channel-specific conversion efficiency.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$customer-segment-performance$slug$,
 'Customer Segment Performance',
 'Understand differences between new vs returning customers and other customer groups.',
 $body$Act as my Shopify customer performance analyst.

Analyse store performance over {{TF}} by customer segment, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. Reference specific segments by name.

Break down performance where available by:
- New vs returning customers, geography, discount users vs non-discount users, high-value vs low-value order bands, returning purchase behaviour or customer cohort patterns

For each segment analyse: conversion rate, orders, revenue, AOV, purchase frequency, differences in product mix or order value.

Identify:
- Highest-value segments
- Lowest-efficiency segments
- Segments with strong traffic but weak conversion
- Segments with strong conversion but weak AOV
- Segments that may need different UX, merchandising, or promotional treatment

Recommend 5 segment-specific actions to improve conversion, retention, or AOV.

Output format:
1. Segment overview
2. Segment comparison table
3. Highest opportunity segments
4. Risks or inefficiencies
5. Recommended actions$body$,
 'LTV',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When you want to understand how different customer types are performing and identify where to invest in conversion, retention, or AOV improvements by segment.',
 'Convert',
 FALSE, TRUE, 1, NOW()),

($slug$discount-and-promotion-impact$slug$,
 'Discount and Promotion Impact',
 'Check whether discounting is helping conversion or masking pricing and UX issues.',
 $body$Act as my Shopify promotions and conversion analyst.

Analyse the impact of discounts and promotions on store performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. Reference specific promotions or discount codes where available.

Review where available:
- Orders using discounts
- Revenue from discounted vs non-discounted orders
- AOV for discounted vs non-discounted orders
- Conversion efficiency of discounted vs non-discounted purchases
- Notable product, collection, or customer patterns linked to discount use

Identify:
- Whether discounts drive incremental conversion or simply reduce margin
- Whether certain products or collections are overly reliant on discounting
- Whether discount use links to stronger or weaker AOV
- Whether patterns suggest customer hesitation, price sensitivity, or promotional dependency

Label findings as: Confirmed / Likely hypothesis / Requires GA4 validation.

Recommend 3–7 actions to improve promotional efficiency, pricing clarity, and conversion quality.

Output format:
1. Discount performance summary
2. Discount vs non-discount comparison
3. Key findings
4. Risks and opportunities
5. Recommended actions$body$,
 'CRO',
 ARRAY['monthly-reporting', 'issue-investigation', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When you need to understand whether your promotional strategy is genuinely growing revenue or just training customers to wait for discounts. Useful before planning the next promotional calendar.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$shopify-benchmark-review$slug$,
 'Shopify Benchmark Review',
 'Check where the store sits against native Shopify benchmark context, without inventing industry comparisons.',
 $body$Act as my ecommerce performance analyst.

Analyse my Shopify store's conversion performance over {{TF}} and compare it to any benchmarks natively available within Shopify.

Do not invent external benchmarks or vertical averages. If Shopify does not provide a benchmark for a requested metric, state that clearly and suggest what should be validated in GA4.

Review:
- Conversion rate
- Reached checkout rate, if available
- Checkout completion rate, if available
- Average order value
- Returning customer rate, if available

Then identify:
- Where the store appears strong relative to available benchmarks
- Where the store appears weak relative to available benchmarks
- Which areas should be prioritised for UX, CRO, or merchandising improvement

Output format:
1. Benchmark summary
2. Metric comparison table
3. Areas of outperformance
4. Areas of underperformance
5. Recommended next actions$body$,
 'Strategy',
 ARRAY['post-launch', 'client-presentation', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'beginner',
 'internal',
 'published',
 'When onboarding a new client or starting a CRO engagement. Sets a baseline understanding of where the store stands before deeper analysis begins.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$homepage-and-entry-page-performance$slug$,
 'Homepage and Entry Page Performance',
 'Identify whether the homepage is converting entry traffic effectively or creating early bounce.',
 $body$Act as my Shopify UX and conversion analyst.

Analyse homepage and top entry page performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. If a metric is unavailable, flag it for GA4 validation. Reference specific landing pages by URL or name where possible.

Identify:
- Top entry pages by volume and conversion rate
- Bounce or exit patterns from homepage vs product or collection pages as entry points
- Any differences in conversion rate by entry page type (homepage vs PLP vs PDP vs campaign landing)
- Cart initiation rate from homepage traffic where available

Flag any patterns that suggest homepage content, hero messaging, navigation, or promotional placement may be causing early funnel drop-off.

Label findings as: Confirmed / Likely hypothesis / Requires GA4 validation.

Output format:
1. Entry page summary
2. Page-level performance table
3. Key findings on homepage efficiency
4. Likely UX or content issues
5. Prioritised recommendations$body$,
 'CRO',
 ARRAY['post-launch', 'issue-investigation', 'qa-validation'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When reviewing homepage effectiveness or investigating high early-funnel drop-off. Useful after a homepage redesign or promotional refresh.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$cart-abandonment-deep-dive$slug$,
 'Cart Abandonment Deep Dive',
 'Identify what is preventing customers from converting after adding to cart.',
 $body$Act as my Shopify cart and checkout conversion specialist.

Analyse cart abandonment patterns over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. If a metric is unavailable, flag it for GA4 or heatmap tool validation.

Review where available:
- Add to cart rate
- Cart abandonment rate (sessions that added to cart but did not reach checkout)
- Checkout abandonment rate (sessions that reached checkout but did not purchase)
- Cart value distribution for abandoned vs completed orders
- Product or category patterns in abandoned carts
- Device-level abandonment differences
- Traffic source or discount usage patterns linked to abandonment

Infer likely causes such as:
- Shipping cost reveal at checkout, payment friction, limited payment options, trust or security concerns, price sensitivity, UX friction in cart or checkout flow

Label all conclusions as: Confirmed by Shopify data / Likely hypothesis / Requires GA4 or heatmap validation.

Recommend 5–7 actions to reduce cart and checkout abandonment.

Output format:
1. Abandonment summary
2. Stage-by-stage drop-off table
3. Segment insights (device, source, value)
4. Likely root causes
5. Prioritised actions$body$,
 'CRO',
 ARRAY['issue-investigation', 'post-launch', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When cart abandonment rates are higher than expected or you need to identify the specific friction points preventing customers from completing checkout.',
 'Convert',
 TRUE, FALSE, 1, NOW()),

($slug$collection-and-category-performance$slug$,
 'Collection and Category Performance',
 'Identify which collections are driving revenue and which are underperforming on traffic and conversion.',
 $body$Act as my Shopify merchandising and conversion analyst.

Analyse collection and category page performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Reference specific collections by name. Flag any metrics that require GA4 validation.

Identify:
- Top collections by revenue and by conversion rate
- High-traffic collections with weak conversion
- Collections with strong conversion but low traffic visibility
- Collections with product availability or range issues that may affect performance
- Any patterns across collection structure, sorting, or filtering that could be affecting conversion

Where available, break down by device type and traffic source.

Label findings as: Confirmed / Likely hypothesis / Requires GA4 validation.

Output format:
1. Collection performance overview
2. Collection comparison table (revenue, sessions, conversion)
3. High-opportunity collections
4. Underperforming collections and likely causes
5. Merchandising and UX recommendations$body$,
 'CRO',
 ARRAY['post-launch', 'opportunity-discovery', 'monthly-reporting'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When reviewing your product catalogue structure or investigating why certain categories are driving strong traffic but weak sales.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$search-and-navigation-behaviour$slug$,
 'Search and Navigation Behaviour',
 'Assess how internal site search and navigation structure is affecting product discovery and conversion.',
 $body$Act as my Shopify UX and conversion analyst.

Analyse internal search and navigation performance over {{TF}}.

Use only data available within Shopify. If a metric is unavailable, flag it for GA4 or heatmap tool validation.

Where available, review:
- Volume of sessions using internal search vs non-search navigation
- Conversion rate for search sessions vs browse sessions
- Top searched terms and any patterns in zero-result searches
- Differences in AOV or purchase rate between searchers and non-searchers
- Navigation paths that most frequently lead to purchase

Infer likely UX or discovery issues such as:
- Product naming mismatches with customer search language, gaps in navigation taxonomy, weak autocomplete or search result relevance, under-indexed collections

Label findings: Confirmed / Likely hypothesis / Requires GA4 or Clarity validation.

Output format:
1. Discovery behaviour summary
2. Search vs browse conversion comparison
3. Top search term patterns
4. Navigation efficiency findings
5. Recommendations to improve product discovery$body$,
 'CRO',
 ARRAY['opportunity-discovery', 'issue-investigation', 'post-launch'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When investigating product discoverability issues or when search is suspected as a conversion lever. Particularly useful when customers frequently search for products that exist but are not easily found.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$customer-lifetime-value-analysis$slug$,
 'Customer Lifetime Value Analysis',
 'Understand the revenue contribution from repeat customers and identify LTV growth opportunities.',
 $body$Act as my Shopify customer value analyst.

Analyse customer lifetime value and repeat purchase behaviour over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not invent benchmarks. Flag anything requiring GA4 validation.

Review where available:
- Returning customer rate and trend
- Revenue contribution from first-time vs returning customers
- Average order count per returning customer
- AOV for first-time vs repeat orders
- Time between first and second purchase, if available
- Top products or collections purchased by high-frequency customers

Identify:
- Whether the store is improving or declining in retention
- Which customer cohorts are highest LTV
- Which products are most associated with repeat purchase behaviour
- Any correlation between first order value and likelihood to return

Output format:
1. LTV and retention summary
2. New vs returning revenue split
3. Repeat purchase behaviour patterns
4. High-LTV product or segment insights
5. Recommendations to grow LTV$body$,
 'LTV',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When assessing customer retention health or building a business case for LTV-focused investment. Key for monthly reporting and strategic reviews.',
 'Convert',
 TRUE, FALSE, 1, NOW()),

($slug$repeat-purchase-cadence-and-cohort-patterns$slug$,
 'Repeat Purchase Cadence and Cohort Patterns',
 'Identify how quickly customers return and whether any cohorts show stronger retention signals.',
 $body$Act as my Shopify retention and cohort analyst.

Analyse repeat purchase cadence and customer cohort behaviour over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Reference specific cohorts or time periods by name where possible. Flag anything requiring additional tools to validate.

Where available, review:
- Percentage of customers placing 2+ orders within the period
- Average days between first and second order
- Cohort retention: what share of customers acquired in a prior period have reordered
- Products most associated with second and third purchase events
- Any seasonal or promotional patterns that appear to drive repeat purchase spikes

Identify:
- Whether repeat purchase rate is improving or declining
- Whether any acquisition channels or first-purchase products correlate with stronger retention
- Time windows where win-back campaigns or reminder triggers would be most effective

Output format:
1. Repeat purchase cadence summary
2. Cohort comparison table where available
3. Products and categories driving retention
4. Key patterns and hypotheses
5. Recommended retention actions$body$,
 'LTV',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'advanced',
 'internal',
 'published',
 'When you need to understand the timing and velocity of repeat purchases to inform email flows, loyalty mechanics, or retention campaign timing.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$high-value-customer-identification$slug$,
 'High-Value Customer Identification',
 'Profile the top customer segment by revenue and identify what drove them to purchase and return.',
 $body$Act as my Shopify customer analytics specialist.

Analyse my top customer segment by revenue over {{TF}}.

Use only data available within Shopify. Do not invent benchmarks. Flag anything that requires GA4 or CRM-level validation.

Where available, identify:
- The top 10–20% of customers by total spend and their share of total revenue
- AOV, order frequency, and product mix for high-value customers
- Geographic or demographic patterns among high-value buyers, if available
- Whether high-value customers are more likely to use or avoid discounts
- Any product categories that appear to be entry points for high-value customer journeys

Then identify:
- Opportunities to acquire more customers who mirror the high-value profile
- Products or collections that should be promoted to increase share of wallet
- Whether loyalty or VIP treatment for this segment is currently supported or missing

Output format:
1. High-value customer profile
2. Revenue concentration analysis
3. Product and category patterns
4. Acquisition and retention opportunities
5. Recommended actions$body$,
 'LTV',
 ARRAY['opportunity-discovery', 'internal-strategy', 'client-presentation'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When developing VIP or loyalty strategies, or when you need to identify which products and channels are most effective at attracting your most valuable customers.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$bfcm-performance-debrief$slug$,
 'BFCM Performance Debrief',
 'Evaluate BFCM campaign performance against pre-period baseline and prior BFCM where possible.',
 $body$Act as my Shopify BFCM performance analyst.

Analyse store performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not invent benchmarks. Reference specific campaigns, discount codes, products, and collections by name.

Review:
- Total revenue, orders, and AOV during the period
- Conversion rate and session volume vs comparison period
- Top-performing products and collections
- Discount code usage and margin impact where available
- Device and traffic source performance during the period
- Returning vs new customer split
- Any notable changes in basket composition or bundle behaviour

Identify:
- Whether the period drove incremental revenue or primarily cannibalised regular-period demand
- Which promotional mechanics drove the strongest conversion
- Where friction or drop-off was highest

Output format:
1. Performance summary
2. KPI comparison table
3. Top-performing campaigns and products
4. Discount and margin impact
5. Key findings and recommendations for next BFCM$body$,
 'BFCM',
 ARRAY['trading-review', 'post-launch', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'Immediately after BFCM or any major peak trading period. Use to debrief what worked, quantify the commercial impact, and set priorities for the next campaign.',
 'Convert',
 TRUE, FALSE, 1, NOW()),

($slug$peak-period-vs-baseline-comparison$slug$,
 'Peak Period vs Baseline Comparison',
 'Quantify the performance uplift during a promotional period and assess whether it generated net-new demand.',
 $body$Act as my Shopify promotional performance analyst.

Compare store performance during {{TF}} against {{CMP}}.

Use only data available within Shopify. Do not invent benchmarks. Reference specific periods and any known promotions by name.

Analyse:
- Revenue, orders, and AOV during each period
- Conversion rate and session volume comparison
- Changes in new vs returning customer mix during the peak period
- Which products and collections drove the uplift
- Whether discount usage was higher during the peak period and the AOV impact
- Whether post-peak demand dropped in a way that suggests demand pull-forward

Determine:
- Whether the period generated genuine incremental demand or redistributed existing demand
- Which channels or segments showed the strongest uplift
- What the most efficient mechanics were for driving conversion

Output format:
1. Period comparison summary
2. KPI uplift table
3. Channel and segment uplift breakdown
4. Demand cannibalisation assessment
5. Recommended strategy adjustments$body$,
 'BFCM',
 ARRAY['trading-review', 'post-launch', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'advanced',
 'internal',
 'published',
 'When you need to determine whether a promotional period genuinely grew the business or simply pulled forward future demand. Critical for evaluating ROI on discounting.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$paid-vs-organic-traffic-quality$slug$,
 'Paid vs Organic Traffic Quality',
 'Assess whether paid acquisition channels are delivering conversion-quality traffic or inflating session volumes.',
 $body$Act as my Shopify acquisition efficiency analyst.

Analyse the quality of paid vs organic traffic over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. Reference specific traffic sources and channels by name. Flag anything that needs GA4 validation.

Where available, review:
- Session volume by channel: paid search, paid social, organic, direct, email, referral
- Conversion rate by channel
- AOV by channel
- Revenue per session by channel
- Returning customer rate by acquisition channel

Identify:
- Channels with the highest conversion quality (revenue per session)
- Channels with high volume but poor conversion efficiency
- Any channels where AOV is significantly different from the store average
- Whether any paid channels appear to be targeting low-intent audiences

Label findings: Confirmed / Likely hypothesis / Requires GA4 validation.

Output format:
1. Channel efficiency summary
2. Performance table by channel
3. High-efficiency vs low-efficiency channels
4. Likely causes and hypotheses
5. Recommended channel strategy adjustments$body$,
 'Acquisition',
 ARRAY['monthly-reporting', 'internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When reviewing paid media spend efficiency or before a quarterly marketing budget review. Useful for identifying channels that generate volume but underperform on conversion quality.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$new-customer-acquisition-analysis$slug$,
 'New Customer Acquisition Analysis',
 'Understand how effectively the store is acquiring new customers and what is driving first purchase.',
 $body$Act as my Shopify new customer acquisition analyst.

Analyse new customer acquisition performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not invent benchmarks. Reference specific products, collections, and sources by name.

Review where available:
- Total new customers acquired and trend vs comparison
- New customer conversion rate vs returning customer rate
- AOV for first-time buyers
- Top products purchased as a first order
- Traffic sources most associated with new customer acquisition
- Geographic distribution of new customers, if available

Identify:
- Whether new customer acquisition is growing, declining, or flat
- Which entry products or campaigns are most effective at driving first purchase
- Whether first-order AOV is healthy relative to store average
- Any friction points specific to new customers (trust signals, payment options, onboarding)

Output format:
1. New customer acquisition summary
2. Acquisition volume and trend
3. First purchase behaviour insights
4. Channel and product analysis
5. Recommendations to improve new customer conversion$body$,
 'Acquisition',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'post-launch'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When the business needs to understand the health of its new customer pipeline and identify what products or channels are most effective as acquisition drivers.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$returns-and-refund-impact-analysis$slug$,
 'Returns and Refund Impact Analysis',
 'Assess whether returns and refunds are a significant commercial drag and identify which products or segments are driving them.',
 $body$Act as my Shopify commercial performance analyst.

Analyse returns and refund activity over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not invent benchmarks. Reference specific products, categories, or order patterns by name.

Review where available:
- Total refunds issued and refund rate as a percentage of revenue
- Products or collections with the highest refund volume
- Refund patterns by customer type (new vs returning) if available
- Any correlation between discount usage and refund rate
- AOV and order value patterns for refunded orders

Identify:
- Whether returns represent a growing or shrinking commercial risk
- Which specific products or categories are driving disproportionate refunds
- Whether product description accuracy, sizing, or expectation gaps may be contributing
- Whether any operational or fulfilment patterns are linked to refunds

Output format:
1. Returns and refund summary
2. Refund volume and rate table
3. High-refund products or segments
4. Likely root causes
5. Recommended actions to reduce refund rate$body$,
 'Strategy',
 ARRAY['monthly-reporting', 'issue-investigation', 'internal-strategy'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When refund rates are high or increasing, or when you need to understand the commercial impact of your returns policy on net revenue.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$inventory-and-stockout-risk$slug$,
 'Inventory and Stockout Risk',
 'Identify which products are at risk of stocking out and whether stockouts are currently suppressing conversion.',
 $body$Act as my Shopify inventory and merchandising analyst.

Analyse inventory performance and stockout risk over {{TF}}.

Use only data available within Shopify. Reference specific products, variants, and collections by name.

Review where available:
- Current inventory levels for top-selling products and variants
- Products that went out of stock during the period and any associated revenue impact
- Sell-through rate for key SKUs
- Products with high demand velocity relative to current stock
- Any patterns linking stockouts to conversion rate drops at collection or product level

Identify:
- Products at immediate risk of stocking out based on current velocity
- Products where variant-level stockouts (size, colour) may be suppressing collection conversion
- Whether any stockout events during the period created material revenue loss

Output format:
1. Inventory health summary
2. At-risk products table
3. Estimated revenue impact of any stockouts
4. Restock priority recommendations
5. Longer-term inventory planning observations$body$,
 'Strategy',
 ARRAY['pre-launch', 'trading-review', 'issue-investigation'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'Before peak periods or when conversion drops are suspected to be related to out-of-stock variants. Also useful for ongoing inventory health monitoring.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$geographic-revenue-distribution$slug$,
 'Geographic Revenue Distribution',
 'Identify where revenue is coming from geographically and assess whether any regions represent untapped opportunity.',
 $body$Act as my Shopify geographic performance analyst.

Analyse revenue and conversion performance by geography over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Reference specific countries, states, or regions by name.

Review where available:
- Revenue and order volume by country or region
- Conversion rate by geography
- AOV by geography
- New vs returning customer split by region
- Any notable shifts in geographic revenue mix vs comparison period

Identify:
- Top-performing regions and any growth trends
- Regions with high session volume but weak conversion
- Regions where AOV is significantly above or below store average
- Whether shipping, currency, or localisation factors may be affecting conversion in specific markets

Output format:
1. Geographic performance summary
2. Revenue and conversion table by region
3. High-opportunity markets
4. Underperforming market analysis
5. Localisation and market development recommendations$body$,
 'Strategy',
 ARRAY['opportunity-discovery', 'internal-strategy', 'monthly-reporting'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When exploring international expansion opportunities or when you need to understand whether certain markets warrant specific localisation or promotional investment.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$seo-driven-revenue-analysis$slug$,
 'SEO-Driven Revenue Analysis',
 'Assess the commercial contribution of organic search traffic and identify SEO-linked conversion gaps.',
 $body$Act as my Shopify SEO and organic performance analyst.

Analyse the revenue contribution of organic search traffic over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Flag any metrics that require GA4 or Search Console validation.

Review where available:
- Session volume from organic search
- Conversion rate for organic sessions vs other channels
- Revenue and AOV for organic traffic
- Products and collections most frequently purchased by organic visitors
- Any shifts in organic session volume that may indicate ranking changes

Identify:
- Whether organic search is growing, declining, or stable as a revenue channel
- Whether organic conversion rate is above or below the store average
- Any patterns suggesting that organic traffic lands on high or low-intent pages
- Opportunities to capture more organic revenue through product or collection page optimisation

Note: keyword-level and page-level organic performance should be validated in GA4 and Google Search Console.

Output format:
1. Organic search revenue summary
2. Channel performance comparison
3. Product and landing page patterns
4. Hypotheses and gaps requiring Search Console validation
5. Recommended SEO-driven revenue actions$body$,
 'SEO',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'GA4', 'Google Search Console'],
 'intermediate',
 'internal',
 'published',
 'When assessing whether SEO is a meaningful revenue channel or when identifying which product and collection pages have the most organic traffic potential.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$email-channel-revenue-analysis$slug$,
 'Email Channel Revenue Analysis',
 'Assess the commercial contribution of email as an acquisition and retention channel and identify segmentation gaps.',
 $body$Act as my Shopify email performance analyst.

Analyse the revenue contribution and conversion performance of email traffic over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Flag anything that requires your ESP (Klaviyo, Shopify Email, etc.) for campaign-level detail.

Review where available:
- Session volume from email as a traffic source and trend vs comparison
- Conversion rate for email sessions vs store average
- Revenue and AOV for email-attributed orders
- New vs returning customer split for email traffic
- Whether email-sourced customers show stronger or weaker AOV than other channels

Identify:
- Whether email is a growing or declining revenue channel
- Whether email conversion efficiency differs significantly between new and returning customer segments
- Any patterns suggesting that email traffic is landing on suboptimal pages
- Gaps in email flow coverage (post-purchase, win-back, browse abandonment) that may be suppressing revenue

Label findings: Confirmed by Shopify data / Likely hypothesis / Requires ESP data validation.

Output format:
1. Email channel revenue summary
2. Email vs other channel performance comparison
3. Customer segment patterns within email traffic
4. Identified flow coverage gaps
5. Recommendations to increase email channel revenue$body$,
 'Acquisition',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Klaviyo', 'Shopify Email'],
 'intermediate',
 'internal',
 'published',
 'When reviewing your email programme performance or preparing a recommendation on where to invest in email flow improvements.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$post-purchase-flow-effectiveness$slug$,
 'Post-Purchase Flow Effectiveness',
 'Review post-purchase upsell performance, repeat purchase triggers, and the effectiveness of thank-you page experiences.',
 $body$Act as my Shopify post-purchase experience analyst.

Analyse post-purchase behaviour and repeat purchase trigger performance over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Flag anything that requires your email platform, Klaviyo, or loyalty app for deeper validation.

Review where available:
- Percentage of first-time buyers who placed a second order within the period
- Average time between first and second order
- Products most commonly purchased as a second order
- Whether post-purchase upsell or cross-sell offers (if enabled) are converting
- Whether any specific first-purchase products are associated with stronger or weaker second-purchase rates

Identify:
- Whether the post-purchase journey is effectively converting first-time buyers into repeat customers
- Which product pairings represent the strongest second-purchase opportunity
- Whether the time-to-second-purchase suggests an email or SMS trigger window is being missed
- Whether any segments (channel, geography, AOV band) have notably different second-purchase rates

Label findings: Confirmed / Likely hypothesis / Requires email platform or loyalty data validation.

Output format:
1. Post-purchase behaviour summary
2. First-to-second purchase conversion table
3. Top repeat-purchase product patterns
4. Trigger timing opportunities
5. Recommended post-purchase optimisation actions$body$,
 'LTV',
 ARRAY['opportunity-discovery', 'monthly-reporting', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Klaviyo'],
 'intermediate',
 'internal',
 'published',
 'When optimising for repeat purchase rate or when evaluating the effectiveness of post-purchase email flows and upsell mechanics.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$price-point-and-margin-health-check$slug$,
 'Price Point and Margin Health Check',
 'Analyse price point distribution and margin signals across the range to identify pricing and conversion friction.',
 $body$Act as my Shopify pricing and commercial analyst.

Analyse price point distribution, margin signals, and pricing-related conversion patterns over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Flag anything that requires your ERP, cost data, or POS system for margin validation.

Review where available:
- Revenue distribution across price bands (e.g. under $50, $50–$100, $100–$200, $200+)
- Conversion rate by price band
- AOV relative to the most purchased price points
- Whether discount usage is concentrated in specific price bands, suggesting price resistance
- Products or collections where traffic is strong but conversion is notably lower than the price band average

Identify:
- Whether any price points are creating conversion drag
- Whether the store's AOV is being pulled down by over-indexing on lower price band transactions
- Whether high-margin products are getting adequate traffic and conversion support
- Any signs of price anchoring opportunities in the range

Label findings: Confirmed by Shopify data / Likely hypothesis / Requires margin data to fully validate.

Output format:
1. Price point distribution summary
2. Conversion rate by price band table
3. Discount concentration patterns
4. Margin and AOV opportunity analysis
5. Recommended pricing strategy adjustments$body$,
 'Strategy',
 ARRAY['internal-strategy', 'opportunity-discovery', 'monthly-reporting'],
 ARRAY['Shopify Analytics'],
 'advanced',
 'internal',
 'published',
 'When developing pricing strategy recommendations or when AOV is below target and you need to understand whether pricing structure is contributing to the issue.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$seasonal-trading-pattern-analysis$slug$,
 'Seasonal Trading Pattern Analysis',
 'Map trading peaks, troughs, and seasonal patterns across the year to inform campaign and inventory planning.',
 $body$Act as my Shopify seasonal performance analyst.

Analyse seasonal trading patterns and year-over-year trends using available data over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Flag anything that requires GA4 or external tools for more granular behavioural analysis.

Review where available:
- Week-by-week or month-by-month revenue and order volume trends
- Conversion rate and AOV patterns across the trading period
- Which product categories or collections show the strongest seasonal demand spikes
- How peak periods compare in terms of new vs returning customer contribution
- Whether any seasonal periods show an unusual drop in conversion that warrants further investigation

Identify:
- The clearest peak and trough periods within the dataset
- Whether seasonal uplifts are driven by new customer acquisition or returning customer reactivation
- Which categories are most sensitive to seasonal demand shifts
- Planning windows where campaign or promotional activity could be introduced or scaled

Label findings: Confirmed by Shopify data / Likely hypothesis / Requires GA4 for landing page and acquisition-level detail.

Output format:
1. Seasonal trading summary
2. Period-by-period performance table
3. Peak and trough analysis
4. Category-level seasonality findings
5. Planning and campaign recommendations for the next 12 months$body$,
 'Strategy',
 ARRAY['internal-strategy', 'trading-review', 'pre-launch'],
 ARRAY['Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When building a 12-month trading calendar or planning promotional and inventory investment for the year ahead. Useful for aligning the client team on peak periods and category seasonality.',
 'Convert',
 FALSE, FALSE, 1, NOW()),

($slug$mobile-conversion-gap-analysis$slug$,
 'Mobile Conversion Gap Analysis',
 'Deep dive into mobile-specific conversion gaps, identifying where mobile underperforms desktop and why.',
 $body$Act as my Shopify mobile UX and conversion analyst.

Analyse mobile device performance in detail over {{TF}}, compared to {{CMP}}.

Use only data available within Shopify. Do not guess or invent benchmarks. Flag anything requiring heatmap or session recording tool validation.

Step 1: Mobile baseline
Compare mobile conversion rate, sessions, revenue, and AOV to:
- Desktop conversion rate for the same period
- Mobile conversion rate in the comparison period

Step 2: Mobile funnel breakdown
Map mobile performance through:
- Product view to add to cart rate on mobile
- Add to cart to checkout initiation rate on mobile
- Checkout completion rate on mobile vs desktop

Identify at which stage mobile drops off most relative to desktop.

Step 3: Traffic source breakdown
Break down mobile performance by traffic source. Identify:
- Which mobile traffic sources have the strongest conversion quality
- Which mobile sources have the biggest gap between session volume and revenue

Step 4: Product and collection gaps on mobile
Identify:
- Products or collections where mobile conversion is significantly weaker than desktop
- Any patterns that might indicate mobile PDP or PLP issues

Step 5: Likely UX friction
Based on the data, infer likely mobile UX issues such as:
- Navigation friction, page load performance, checkout flow friction, product image loading, CTA placement or visibility

Label each finding: Confirmed / Likely hypothesis / Requires Clarity or Hotjar validation.

Output format:
1. Mobile vs desktop performance summary
2. Mobile funnel stage comparison table
3. Traffic source efficiency on mobile
4. Product and collection mobile gaps
5. Prioritised mobile optimisation actions$body$,
 'CRO',
 ARRAY['issue-investigation', 'post-launch', 'qa-validation'],
 ARRAY['Shopify Analytics', 'GA4', 'Hotjar', 'Microsoft Clarity'],
 'advanced',
 'internal',
 'published',
 'When mobile accounts for the majority of sessions but conversion significantly lags desktop. Essential for stores with high social or paid social traffic.',
 'Convert',
 FALSE, FALSE, 1, NOW());

-- ────────────────────────────────────────────────────────────────
-- SHOPIFY SUPPLIED PROMPTS (27)
-- ────────────────────────────────────────────────────────────────

INSERT INTO prompts (slug, title, short_description, prompt_body, category, use_cases, data_sources, level, visibility, status, when_to_use, caveats, source_label, is_featured, is_recommended, version, published_at)
VALUES

($slug$30-30-30-store-analysis$slug$,
 '30-30-30 Store Analysis',
 'Compares last 30 days, the previous 30 days, and same period last year across key metrics to reveal performance shifts.',
 $body$Act as my expert Shopify data analyst. Perform a 30-30-30 analysis of store performance, defined as:

1. Last 30 days
2. Same 30 days in the prior period
3. Same 30 days last year

Metrics to include:
- Average Order Value (AOV)
- Conversion Rate (CVR)
- Sessions
- Returning Customers (# and %)
- New Customers (# and %)
- Orders
- Total Sales
- RFM segment performance (Recency, Frequency, Monetary)
- Any additional KPIs that materially impact store growth

For each metric:
- Display all three 30-day periods side-by-side in a table
- Show % change vs prior period and vs last year
- Highlight the top positive and negative movements

Additional analysis:
- Identify which customer segments, products, channels, or campaigns contributed most to the metric changes
- Flag anomalies or sudden shifts in customer behaviour
- Recommend 3–5 specific actions to improve underperforming areas and double down on high-performing ones

Output:
1. Comparison table for all metrics
2. Simple visual chart for key trend lines
3. Clear summary of takeaways and prioritised recommendations$body$,
 'Strategy',
 ARRAY['monthly-reporting', 'trading-review', 'client-presentation'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'beginner',
 'internal',
 'published',
 'A reliable monthly review format. Use when you want a structured, comparable view of store performance across three time periods in a single pass.',
 NULL,
 'Shopify',
 TRUE, FALSE, 1, NOW()),

($slug$abandoned-checkout-recovery-optimisation$slug$,
 'Abandoned Checkout Recovery Optimisation',
 'Pinpoints checkout drop-off points segmented by device, source, and customer type, with prioritised recovery strategies.',
 $body$Act as my Shopify conversion optimisation specialist. Analyse my store's checkout abandonment rate over {{TF}} and identify the causes and solutions.

Step 1: Metric review
Calculate checkout abandonment rate and compare to {{CMP}}.

Break down abandonment by:
- Device type (desktop, mobile, tablet)
- Traffic source
- New vs returning customers
- Payment method selection
- Shipping method selection

Step 2: Behaviour and funnel analysis
- Identify the most common drop-off points in the checkout funnel
- Analyse load time, form field friction, and error rates at checkout
- Review payment gateway performance and error codes
- Detect abandoned checkout patterns linked to specific products, discounts, or cart values

Step 3: Optimisation strategies
Recommend 3–5 targeted strategies to reduce abandonment, such as:
- Streamlining checkout steps (Shopify one-page checkout)
- Offering accelerated payment options (Shop Pay, Apple Pay, Google Pay)
- Improving shipping transparency (costs, delivery times)
- Testing trust badges, security signals, and urgency messaging
- Retargeting with abandoned checkout emails/SMS flows via Shopify Automations or Shopify Email

Step 4: Output
1. Summary table with abandonment rate breakdowns
2. Funnel drop-off visualisation
3. Prioritised action plan with estimated impact on conversion$body$,
 'CRO',
 ARRAY['issue-investigation', 'post-launch', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'When checkout abandonment is a known problem or when optimising checkout flow ahead of a peak period.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$acquisition-channel-performance-summary$slug$,
 'Acquisition Channel Performance Summary',
 'Analyses the top three acquisition channels, recent paid campaign performance, and underperforming audience segments.',
 $body$Act as my expert Shopify growth strategist. Analyse acquisition performance across channels, campaigns, and audience segments over {{TF}}, compared to {{CMP}}.

Step 1: Top acquisition channel analysis
Identify my top 3 acquisition channels over {{TF}}.

For each channel, provide:
- Customer Acquisition Cost (CAC)
- Conversion Rate (CVR)
- Return on Investment (ROI)

Recommend where to increase, maintain, or reduce investment based on performance and scalability.

Step 2: Paid campaign performance review
Analyse my latest paid marketing campaigns by:
- CAC, CVR, ROI, and Cost per Acquisition (CPA)
- New customer acquisition volume

Identify 3–5 optimisations that would drive more new customer growth (e.g. creative, targeting, bidding, landing pages).

Step 3: Audience segment acquisition gaps
- Highlight underperforming audience segments in terms of acquisition efficiency (high CAC or low CVR)
- Suggest specific experiments to improve conversion (e.g. tailored offers, messaging changes, remarketing strategies)

Step 4: Output format
1. Table comparing the top 3 channels (CAC, CVR, ROI) with investment recommendations
2. Campaign performance summary with optimisation suggestions
3. Audience segment performance table and recommended experiments
4. Prioritised action list for next 30 days$body$,
 'Acquisition',
 ARRAY['monthly-reporting', 'internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'During paid media performance reviews or when planning quarterly acquisition budget allocation.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$aov-cvr-correlation-analysis$slug$,
 'AOV–CVR Correlation Analysis',
 'Analyses the relationship between Average Order Value and Conversion Rate, modelling the impact of AOV changes on CVR.',
 $body$Act as my ecommerce data analyst. Perform an AOV–CVR correlation analysis for {{TF}} using daily data points.

Step 1: Data and correlation
- Extract daily Average Order Value (AOV) and Conversion Rate (CVR)
- Calculate the Pearson correlation coefficient between AOV and CVR
- Generate a linear regression equation showing how CVR changes as AOV changes
- Compute the R-squared value to measure the strength of the relationship

Step 2: Predictive insights
- Estimate CVR change for every $50 increase in AOV
- Predict CVR impact if AOV increases by 20%
- Identify the optimal AOV–CVR balance point for maximising revenue
- Answer: "What happens to conversion rate when we increase prices?"

Step 3: Visualisation
Plot both AOV (in dollars) and CVR (in %) on the same timeline:
- Date range on X-axis
- Dual Y-axis (Left = AOV $, Right = CVR %)
- Include trend lines for both metrics
- Clearly illustrate any inverse relationship

Step 4: Output format
1. Chart and summary table of correlation stats, regression formula, and predicted CVR impacts
2. Brief recommendations for pricing or promotional adjustments based on findings$body$,
 'Strategy',
 ARRAY['internal-strategy', 'opportunity-discovery', 'monthly-reporting'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'When analysing the trade-off between pricing strategy and conversion rate, or when building a pricing model recommendation for a client.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$app-vs-native-shopify-functionality-audit$slug$,
 'App vs Native Shopify Functionality Audit',
 'Reviews all installed apps, identifies native Shopify replacements, and calculates potential monthly cost savings.',
 $body$Act as my expert Shopify solutions consultant. Review my currently installed apps and identify which can be replaced by:

- Native Shopify functionality (including the latest feature releases)
- Free Shopify apps from the Shopify App Store

For each app:
- Name of the app and its core function
- Equivalent Shopify native feature(s) or free app(s) that could provide the same or better results
- Notes on any trade-offs or limitations of the native/free replacement
- Monthly cost of the current app vs cost of the alternative (include $ savings per month)

Additional requirements:
- Prioritise by ease of migration (Quick Win, Medium Effort, Complex Migration)
- Highlight features recently added to Shopify (e.g. Shopify Subscriptions, Shopify Bundles, Shopify Flow, Shopify Markets, Shopify POS) that could replace existing apps
- Provide a summary table of total potential monthly savings and a recommended action order

Output:
1. Detailed app-by-app replacement report
2. Summary of savings potential
3. Suggested next steps to transition away from paid apps where feasible$body$,
 'Tech',
 ARRAY['internal-strategy', 'onboarding'],
 ARRAY['Shopify Admin'],
 'beginner',
 'internal',
 'published',
 'When onboarding a new client, doing a tech stack review, or when app costs are becoming a concern. Also useful ahead of a platform upgrade or replatforming project.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$audience-overlap-evaluation$slug$,
 'Audience Overlap Evaluation',
 'Optimises Shopify Audiences by aligning custom audiences with top-performing customer segments and identifying high-intent lookalikes.',
 $body$Act as my expert audience strategist. Using Shopify Audiences (US only) and my store's customer data over {{TF}}, perform the following analysis:

Step 1: Audience overlap and alignment
- Evaluate the overlap between my custom audiences and my best-performing customer segments (e.g. highest RFM scores, top LTV, repeat buyers)
- Identify gaps or mismatches where targeting could be refined for better relevance and efficiency

Step 2: Campaign performance review
- Analyse performance metrics (conversion rate, AOV, ROAS, CAC) from recent campaigns using Shopify Audiences
- Highlight which audiences, creatives, and channels drove the strongest results
- Flag underperforming audiences and suggest adjustments (exclusions, narrowing, sequencing)

Step 3: High-intent lookalike opportunities
Recommend new lookalike audiences based on my highest-value cohorts, including:
- Top spenders, most frequent purchasers, fastest-to-repeat buyers

Prioritise audiences most likely to improve reach without diluting quality.

Step 4: Output
1. Overlap analysis findings
2. Top 3 targeting refinement recommendations
3. 2–3 high-intent lookalike audiences to create next
4. Key performance metrics to track after changes$body$,
 'Acquisition',
 ARRAY['internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Audiences', 'Shopify Analytics'],
 'advanced',
 'internal',
 'published',
 'When optimising paid social campaigns using Shopify Audiences, particularly for US-based stores looking to improve ROAS through better audience targeting.',
 'Shopify Audiences is currently only available to US merchants.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$bot-traffic-detection-report$slug$,
 'Bot Traffic Detection Report',
 'Detects and analyses bot traffic by examining geographic, behavioural, source, timing, and conversion patterns.',
 $body$Act as my Shopify traffic quality analyst. Review my store's analytics over {{TF}} to detect potential bot traffic and distinguish it from legitimate activity.

Step 1: Geographic analysis
- Identify traffic from data centres or cloud hosting providers vs expected geographic markets
- Flag suspicious locations with zero conversions or extremely low engagement

Step 2: Behavioural indicators
Detect patterns of:
- Extremely high bounce rates
- Very short (<1 sec) or abnormally long sessions without interaction
- Zero page views or single-page visits with immediate exits

Step 3: Traffic source patterns
- Review unusual referrers or spikes in direct traffic outside normal patterns
- Highlight traffic sources that generate no meaningful engagement

Step 4: Time-based patterns
- Spot constant 24/7 traffic or irregular spikes that differ from normal business-hour peaks

Step 5: Device and browser anomalies
- Identify abnormal concentrations of specific user agents, outdated browsers, or suspicious device types

Step 6: Conversion and engagement comparison
- Compare conversion rate, add-to-cart rate, and session quality between suspected bot traffic and legitimate visitors

Step 7: Output format
1. Table of suspicious traffic patterns with metric anomalies
2. Comparison chart: suspicious vs legitimate traffic performance
3. Action recommendations (blocking, filtering, bot protection settings)$body$,
 'Tech',
 ARRAY['qa-validation', 'issue-investigation'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When conversion rates are unexpectedly low despite high session volumes, or when investigating unusual traffic spikes that do not result in sales.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$buyer-progression-trend-analysis$slug$,
 'Buyer Progression Trend Analysis',
 'Analyses sales data to track customer movement from Net New to Repeat to VIP segments with personalised engagement strategies.',
 $body$Act as my expert ecommerce data analyst. Analyse {{TF}} of sales data to uncover patterns in buyer progression from Net New → Repeat → VIP customers.

Trend analysis
- Identify key behaviours, purchase frequency, and timeframes that drive customers from one segment to the next

Revenue and transaction breakdown
- Determine which segment (Net New, Repeat, VIP) generated the highest total revenue and most transactions over the period

Action recommendations
- For each segment, provide personalised engagement strategies to increase retention and accelerate progression to the next tier
- Include tactics that balance short-term conversion boosts with long-term customer lifetime value growth

Present your findings as a concise, actionable report with:
1. Key metrics for each segment
2. Top 3 drivers of progression between segments
3. Tailored recommendations for each segment$body$,
 'LTV',
 ARRAY['monthly-reporting', 'opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'When building a customer journey strategy or when you want to understand what drives customers to move from one-time buyers to loyal repeat purchasers.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$campaign-tactic-effectiveness-breakdown$slug$,
 'Campaign Tactic Effectiveness Breakdown',
 'Dissects a campaign''s true incremental impact, pinpoints effective tactics and channels, and delivers prioritised test recommendations.',
 $body$Act as my expert ecommerce performance analyst. For [Campaign Name], dissect performance across key dimensions to determine which tactics drove incremental sales beyond baseline performance.

Step 1: Incrementality analysis
- Compare campaign sales and AOV against baseline (previous comparable period)
- Identify the percentage and dollar value of incremental sales and orders

Step 2: Offer, messaging and timing effectiveness
- Evaluate which creative, messaging, and offer types performed best
- Analyse conversion lift by campaign start date/time and duration

Step 3: Channel and attribution insights
- Break down sales and conversions by channel (email, paid social, organic, referral, SMS, etc.)
- Review first-touch, last-touch, and multi-touch attribution for discrepancies or hidden opportunities
- Assess impact of cross-channel journeys on conversion

Step 4: Audience and product impact
- Identify RFM segments and cohorts that responded most strongly
- Review new vs returning customer contribution
- Highlight best-performing products, bundles, and basket compositions during the campaign

Step 5: Next steps
- Recommend 3–5 tests for future campaigns based on findings
- Prioritise by expected ROI and ease of implementation

Output: Deliver a concise, decision-ready report with:
1. Incremental sales breakdown
2. Top-performing tactics and channels
3. Key attribution learnings
4. Recommended future tests$body$,
 'Strategy',
 ARRAY['post-launch', 'trading-review', 'client-presentation'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'After completing a major campaign to understand true incremental impact and inform future campaign strategy.',
 'Replace [Campaign Name] with the actual campaign name before using.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$checkout-funnel-drop-off-analysis$slug$,
 'Checkout Funnel Drop-Off Analysis',
 'Maps the checkout funnel, compares to industry benchmarks, and delivers Shopify-specific tactics to remove friction.',
 $body$Act as my Shopify conversion optimisation expert. Perform a deep analysis of my store's checkout funnel over {{TF}}, compared to {{CMP}}.

Step 1: Funnel analysis
Map my checkout funnel stages from product view → add-to-cart → checkout initiation → order completion.

Identify where the largest drop-offs occur (by percentage and absolute number).
Break down drop-offs by:
- Device type (desktop, mobile, tablet)
- Traffic source and campaign
- New vs returning customers
- Payment and shipping method choices

Step 2: Benchmark comparison
- Compare my conversion rate (CVR) to industry benchmarks for my vertical
- Highlight where my store outperforms or underperforms
- Identify high-impact improvement areas based on current store setup, features, and traffic mix

Step 3: Advanced optimisation tactics
Recommend specific, Shopify-optimised strategies for the identified friction points, such as:
- One-page checkout
- Accelerated payment options (Shop Pay, Apple Pay, Google Pay)
- Contextual upsells and cross-sells in checkout
- Dynamic shipping cost calculators
- Trust signals, urgency prompts, and personalised checkout flows

Step 4: Output format
1. Funnel drop-off chart with stage-by-stage conversion rates
2. Benchmark comparison table
3. Prioritised action list with estimated ROI impact$body$,
 'CRO',
 ARRAY['issue-investigation', 'post-launch', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'When investigating low checkout completion rates or preparing a Shopify-specific checkout optimisation recommendation.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$customer-journey-funnel-drop-off-analysis$slug$,
 'Customer Journey Funnel Drop-Off Analysis',
 'Analyses the Shopify customer journey to pinpoint where and why drop-offs occur across pages, devices, and traffic sources.',
 $body$Act as my Shopify conversion optimisation analyst. Conduct a detailed funnel analysis over {{TF}} to identify drop-off points across my entire customer journey.

Step 1: Funnel mapping and drop-off identification
Map the journey from landing page → product page → add-to-cart → checkout initiation → order completion.
Provide quantified drop-off percentages for each stage.

Step 2: Product page abandonment
- Identify product pages with the highest abandonment rates
- Include page URLs and abandonment percentages
- Highlight potential causes (e.g. slow load time, unclear pricing, lack of reviews)

Step 3: Checkout step failures
- Pinpoint specific checkout steps where customers abandon
- Break down by device type (mobile, desktop, tablet)

Step 4: Traffic source performance
- Identify traffic sources (organic, paid, email, social, referral) with the lowest conversion rates
- Include drop-off percentage from initial visit to completed order

Step 5: Output format
1. Funnel chart showing drop-off at each stage
2. Table of product page abandonment rates with URLs
3. Traffic source conversion performance table
4. Prioritised list of actionable recommendations to reduce drop-offs$body$,
 'CRO',
 ARRAY['issue-investigation', 'post-launch'],
 ARRAY['Shopify Analytics', 'GA4'],
 'intermediate',
 'internal',
 'published',
 'When conducting a full-funnel CRO audit and you need to identify the highest-priority drop-off points across the entire customer journey.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$customer-lifetime-value-opportunity-finder$slug$,
 'Customer Lifetime Value Opportunity Finder',
 'Leverages RFM and cohort analysis to identify products, channels, and behaviours that drive the highest lifetime value.',
 $body$Act as my expert ecommerce growth strategist. Using RFM customer analysis and cohort analysis in Shopify over {{TF}}, identify actionable opportunities to increase customer lifetime value (CLV).

Customer insights
- Segment customers by Recency, Frequency, and Monetary value
- Analyse cohort behaviours over time to identify retention and repeat purchase trends

Performance drivers
- Identify which channels, campaigns, products, bundles, cart combinations, and referrers are most associated with high-value customer segments
- Highlight which acquisition sources consistently lead to customers moving into higher RFM tiers

Opportunity mapping
- Pinpoint underperforming segments and their purchase behaviours
- Suggest targeted actions to move customers into higher-value cohorts (e.g. upsell strategies, bundle optimisation, targeted campaigns)

Output
1. Table of top value drivers (sorted by impact on CLV)
2. 3–5 prioritised strategies to grow CLV, categorised by quick wins vs long-term plays$body$,
 'LTV',
 ARRAY['opportunity-discovery', 'internal-strategy', 'monthly-reporting'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'When building a CLV improvement roadmap or preparing a strategic recommendation on where to focus LTV investment.',
 NULL,
 'Shopify',
 TRUE, FALSE, 1, NOW()),

($slug$frequently-bought-together-and-bundle-pricing$slug$,
 'Frequently Bought Together and Bundle Pricing Analysis',
 'Analyses transactions to find statistically significant product pairings and recommends top bundles with optimised pricing.',
 $body$Act as my Shopify merchandising analyst. Analyse {{TF}} of transactions across my full product catalogue to identify high-value frequently bought together product combinations.

Step 1: Data filtering
- Use only valid completed orders (exclude test or cancelled orders)
- Include only transactions with 2+ items
- Exclude same product variants (different sizes/colours of the same item)

Step 2: Statistical criteria for inclusion
- Minimum support: 0.5% of all transactions
- Minimum confidence: 30% (when Product A is purchased, Product B is purchased at least 30% of the time)
- Minimum lift: 2.0 (combination occurs at least twice as often as random chance)

Step 3: Output for each combination
For the top 25 combinations (sorted by highest lift score), provide:
- The two products frequently bought together
- Number of times purchased together
- Confidence % (likelihood of buying B when A is purchased)
- Lift score (strength of the relationship)
- Average combined order value
- Suggested bundle price with a 15–20% discount

Step 4: Grouping and implementation
- Group results by the primary product's category for easier merchandising
- Highlight the top 3 bundles in each category with the strongest lift score and revenue potential

Step 5: Output format
1. Table of top 25 combinations with all metrics
2. Category-based grouping for merchandising use
3. Bundle pricing recommendations with projected revenue impact$body$,
 'Strategy',
 ARRAY['opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'When developing a bundling strategy or when looking for AOV improvement opportunities through complementary product pairings.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$high-value-customer-cohort-analysis$slug$,
 'High-Value Customer Cohort Analysis',
 'Identifies the most valuable customer cohorts, analyses churn risks, and delivers targeted Shopify retention strategies.',
 $body$Act as my Shopify customer retention strategist. Analyse my store's customer base over {{TF}} to identify the most valuable cohorts and create strategies to maximise their lifetime value.

Step 1: Cohort identification and value analysis
Segment customers using RFM analysis and cohort analysis.
Identify the highest-value customer cohorts based on:
- Lifetime Value (LTV), purchase frequency, Average Order Value (AOV), retention rate over time

Step 2: Churn risk analysis
- Measure churn rates across different customer segments (RFM tiers, acquisition channels, product categories)
- Identify patterns or triggers that signal high churn risk (e.g. long gaps between purchases, drop in order value, reduced engagement)

Step 3: Retention initiatives and flow optimisation
Review current post-purchase engagement flows (emails, SMS, loyalty programs).
Recommend specific improvements to increase repeat purchases, such as:
- Personalised reorder reminders
- Exclusive offers for high-LTV customers
- Loyalty tier rewards and early access to sales
- Win-back campaigns for lapsed customers

Step 4: Output format
1. Table of top customer cohorts with key metrics (LTV, frequency, AOV, churn rate)
2. Churn risk summary by segment
3. Prioritised retention action plan with projected LTV uplift$body$,
 'LTV',
 ARRAY['monthly-reporting', 'internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'When developing a retention and loyalty strategy, particularly when churn among high-value customers is a concern.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$holiday-sales-forecast-and-bfcm-readiness$slug$,
 'Holiday Sales Forecast and BFCM Campaign Readiness',
 'Forecasts holiday sales based on inventory and historical performance, recommends BFCM pricing strategies and email readiness.',
 $body$Act as my Shopify ecommerce strategist. Use my store's current inventory levels, last year's sales data, and marketing readiness to forecast holiday sales potential and recommend high-impact BFCM strategies.

Step 1: Holiday sales potential forecast
- Use current inventory levels and historical holiday/BFCM sales data to project total sales potential
- Factor in product seasonality, current sell-through rates, and potential stock constraints
- Identify SKUs with the highest projected contribution to revenue

Step 2: Promotional pricing strategy
Recommend BFCM pricing and promotional tactics tailored to my product mix, including:
- Discount structures (percentage, fixed, tiered)
- Bundling opportunities
- Limited-time offers to create urgency

Forecast expected sales and margin impact for each strategy.

Step 3: Email subscriber growth and segmentation readiness
- Analyse subscriber list growth over the past 12 months
- Assess current segmentation setup for targeting during holiday campaigns (e.g. high-value customers, recent buyers, inactive customers)
- Recommend list-building or re-engagement tactics to maximise email revenue during BFCM

Step 4: Output format
1. Holiday sales potential table by product category/SKU
2. Promotional pricing recommendation matrix with projected ROI
3. Email list health and segmentation readiness report
4. Action plan for next 30–60 days leading into BFCM$body$,
 'BFCM',
 ARRAY['pre-launch', 'trading-review', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports', 'Klaviyo'],
 'advanced',
 'internal',
 'published',
 'In the 30–60 days before BFCM to forecast potential revenue, identify inventory gaps, and prepare promotional and email strategy.',
 NULL,
 'Shopify',
 TRUE, FALSE, 1, NOW()),

($slug$last-year-performance-audit$slug$,
 'Last Year Performance Audit',
 'Analyses the same period last year to highlight best sellers, top campaigns, worst ROAS channels, CAC, and refund rates.',
 $body$Act as my Shopify performance analyst. Pull store data for {{TF}} and provide a detailed performance review comparing it to the same period in the prior year.

Step 1: Product performance
- Identify best-selling products (units sold, revenue)
- Highlight underperforming products with low sales or high return rates

Step 2: Marketing campaigns
- List top-performing campaigns ranked by ROI/ROAS
- Identify campaigns with the worst ROAS by channel (paid search, social, email, referral, etc.)

Step 3: Acquisition and profitability metrics
- Calculate Customer Acquisition Cost (CAC) by channel
- Provide refund/return rates by product category or campaign

Step 4: Insights and learnings
- Summarise what worked (high-performing products, channels, campaigns)
- Summarise what didn't (low ROAS, high CAC, high refund rates)
- Recommend 3–5 data-driven actions for improving performance in the next cycle

Step 5: Output format
1. Table of key metrics (products, campaigns, channels)
2. Short "Worked / Didn't Work" summary
3. Actionable recommendations list$body$,
 'Strategy',
 ARRAY['monthly-reporting', 'trading-review', 'client-presentation'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'beginner',
 'internal',
 'published',
 'For annual or quarterly strategic reviews. Excellent for identifying patterns from the previous year to inform the next planning cycle.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$multi-item-purchase-and-cross-sell-opportunity$slug$,
 'Multi-Item Purchase and Cross-Sell Opportunity Analysis',
 'Analyses multi-item purchase behaviour to reveal top bundles, high-value customer segments, and untapped cross-sell opportunities.',
 $body$Act as my Shopify data analyst. Analyse multi-item purchase behaviour over {{TF}} to uncover bundling trends and missed cross-sell opportunities.

Step 1: Transaction filtering
- Filter transactions to include only orders with 2 or more items
- Calculate the total number of multi-item orders and their share of total orders

Step 2: Bundling patterns
- Identify the most frequently bundled products and product combinations
- Highlight top bundles by frequency and by total revenue generated

Step 3: AOV and customer segments
- Calculate the average order value (AOV) for multi-item orders
- Compare AOV of multi-item orders vs single-item orders
- Identify customer segments (e.g. RFM tiers, acquisition channels, geographic regions) most likely to place multi-item orders

Step 4: Cross-sell opportunities
- Highlight cross-sell opportunities by finding products often purchased together but not actively promoted together
- Recommend 3–5 product pairings or bundle offers to increase basket size

Step 5: Output format
1. Table of top product bundles (frequency, revenue)
2. Segment breakdown for multi-item purchasers
3. Cross-sell recommendation list with projected revenue uplift$body$,
 'Strategy',
 ARRAY['opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'When looking to increase AOV through cross-sell or bundle mechanics, or when reviewing merchandising strategy.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$recurring-sale-performance-and-recommendations$slug$,
 'Recurring Sale Performance and Recommendations',
 'Analyses a specific recurring campaign''s performance, benchmarks it, identifies weaknesses, and delivers optimisation recommendations.',
 $body$Act as my expert ecommerce performance analyst. For [Campaign Name] (from [Start Date] to [End Date]), extract and analyse my store's performance data with the following focus:

Key metrics
- Average Order Value (AOV)
- Total sales volume
- Conversion rate
- Traffic sources breakdown
- Performance of specific promotions (discount code usage, bundle effectiveness)

Competitive benchmarking
- Compare each metric against similar merchants in my vertical and GMV tier

Actionable insights
- Identify specific performance weaknesses from [Campaign Name]
- Based on these insights and competitive benchmarks, provide concrete recommendations to optimise this year's [Campaign Name] sale, aiming to increase sales, AOV, and overall profitability

Present findings as a clear, decision-ready report including:
1. Key metrics table (my performance vs benchmark)
2. Top 3 areas of underperformance
3. Targeted recommendations for each improvement area$body$,
 'CRO',
 ARRAY['trading-review', 'post-launch', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'intermediate',
 'internal',
 'published',
 'After a recurring sale event (e.g. mid-year sale, Boxing Day) to analyse what worked and optimise for the next occurrence.',
 'Replace [Campaign Name], [Start Date], and [End Date] with your actual campaign details before using.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$seo-keyword-opportunity-finder$slug$,
 'SEO Keyword Opportunity Finder',
 'Finds high-impact keywords the store can target, identifies competitor keyword gaps, and provides a placement strategy.',
 $body$Act as my Shopify SEO strategist. Identify high-value keyword opportunities to improve my homepage and product page rankings.

Step 1: Keyword research
- Analyse my store's category, product offerings, and target audience
- Identify high-volume, low-competition keywords relevant to my products
- Include both primary keywords (for main pages) and long-tail keywords (for specific products)

Step 2: Competitor keyword gap analysis
- Review competitor rankings for my niche
- Highlight keywords competitors rank for that my store does not
- Identify keyword opportunities with strong purchase intent

Step 3: Keyword application strategy
Recommend which keywords should be used on:
- Homepage (title, H1, meta description, body content)
- Product titles and descriptions
- Collection pages

Provide example rewrites for 2–3 product titles/descriptions using these keywords.

Step 4: Output format
1. Table of recommended keywords (search volume, competition score, intent type)
2. Competitor gap list
3. Suggested placement strategy for top 10 keywords$body$,
 'SEO',
 ARRAY['opportunity-discovery', 'internal-strategy', 'post-launch'],
 ARRAY['Google Search Console', 'GA4', 'Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When starting an SEO programme or identifying quick-win keyword opportunities for product and collection pages.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$seo-opportunity-audit$slug$,
 'SEO Opportunity Audit',
 'Performs a detailed SEO analysis of the store, highlighting quick wins and improvements to boost organic traffic.',
 $body$Act as my Shopify SEO specialist. Perform a detailed SEO analysis of my store and identify improvements to boost search visibility, rankings, and organic traffic.

Step 1: Homepage SEO review
- Evaluate meta title, meta description, and heading structure (H1, H2, H3)
- Check for keyword optimisation, internal linking, and content depth
- Assess image optimisation (file names, alt tags, compression)
- Identify technical SEO issues impacting page speed or crawlability

Step 2: Product page SEO review
- Analyse product titles for keyword relevance, clarity, and click-through potential
- Review meta titles and descriptions for SEO best practices and engagement
- Assess product descriptions for keyword coverage, uniqueness, and readability
- Check for missing alt tags, structured data/schema, and duplicate content

Step 3: Areas of opportunity
- Highlight gaps in keyword targeting and content optimisation
- Identify opportunities for internal linking between related products and collections
- Flag missing or underused SEO features in Shopify (e.g. automated sitemap, 301 redirects)

Step 4: Quick wins and easy improvements
- Provide a prioritised list of quick SEO fixes (e.g. title rewrites, meta description updates, image alt tag additions)
- Include examples of improved titles/descriptions for key products

Step 5: Output format
1. Table with current vs recommended changes for homepage, product pages, and titles
2. Quick-win checklist with estimated SEO impact$body$,
 'SEO',
 ARRAY['onboarding', 'opportunity-discovery', 'post-launch'],
 ARRAY['Shopify Admin', 'Google Search Console'],
 'beginner',
 'internal',
 'published',
 'When onboarding a new client for SEO or when conducting an initial SEO health check to identify the highest-priority improvements.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$site-speed-and-traffic-surge-readiness$slug$,
 'Site Speed and Traffic Surge Readiness Check',
 'Evaluates site speed, holiday traffic readiness, checkout setup, and mobile experience before peak periods.',
 $body$Act as my Shopify ecommerce performance consultant. Assess my store's technical readiness and checkout optimisation opportunities ahead of BFCM [BFCM dates].

Step 1: Site speed and capacity
- Evaluate current site speed scores (desktop and mobile) using Shopify's latest performance metrics
- Test load times during peak simulated traffic to assess capacity for holiday surges
- Identify any performance bottlenecks (apps, large media files, theme code issues)

Step 2: Checkout optimisation opportunities
Review current checkout setup and highlight friction points.
Recommend Shopify-optimised strategies for increasing conversion, such as:
- One-page checkout
- Accelerated payment options (Shop Pay, Apple Pay, Google Pay)
- Streamlined form fields and guest checkout
- Shipping transparency and real-time delivery estimates

Step 3: Mobile experience audit
Review mobile storefront usability, including:
- Page load speed, navigation and menu usability, product page layout and buy button placement, checkout flow on mobile

Identify critical pre-holiday improvements to boost mobile conversion rates.

Step 4: Output format
1. Performance and capacity scores with benchmarks
2. List of technical fixes and mobile optimisations (prioritised by impact and ease)
3. Checkout improvement recommendations with projected uplift in conversion rate$body$,
 'Tech',
 ARRAY['pre-launch', 'qa-validation'],
 ARRAY['Shopify Admin', 'Google PageSpeed'],
 'intermediate',
 'internal',
 'published',
 'In the 4–6 weeks before a major trading period to identify and resolve technical issues before traffic spikes.',
 'Replace [BFCM dates] with your specific dates before using.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$slow-moving-sku-strategy-planner$slug$,
 'Slow-Moving SKU Strategy Planner',
 'Identifies slow-moving SKUs, forecasts stockout risks, and delivers strategies to liquidate or reposition products.',
 $body$Act as my Shopify inventory and merchandising strategist. Analyse my store's inventory performance, slow-moving SKUs, and stock risk over {{TF}} to improve profitability and working capital efficiency.

Step 1: Slow-moving SKU analysis
- Identify the slowest-moving SKUs based on sales velocity, age in stock, and sell-through rate
- Segment by product category, seasonality, and margin contribution
- Recommend strategies to liquidate, bundle, discount, or reposition these SKUs to recover capital

Step 2: Sell-through and stockout forecasting
- Analyse historical sell-through rates and seasonal trends
- Forecast potential stockouts for high-demand products
- Recommend Shopify-native tools and automations (e.g. low-stock alerts, Shopify Flow, automated reorder points) to prevent lost sales

Step 3: Inventory holding cost impact
- Calculate inventory holding costs for slow-moving SKUs
- Identify the impact on gross margin and overall profitability
- Recommend adjustments to improve working capital efficiency

Step 4: Output format
1. Table of slow-moving SKUs with sales velocity, sell-through rate, margin %, and recommended action
2. Stockout risk forecast table
3. Profitability impact summary with prioritised actions$body$,
 'Strategy',
 ARRAY['trading-review', 'internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'When managing working capital, ahead of a clearance sale, or when preparing inventory for a peak trading period.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$social-roas-and-engagement-analysis$slug$,
 'Social ROAS and Engagement Analysis',
 'Evaluates social platform performance, analyses UTM data to link creatives to conversions, and uncovers remarketing gaps.',
 $body$Act as my Shopify marketing performance strategist. Evaluate the effectiveness of my social media campaigns, content, and remarketing strategy over {{TF}}, compared to {{CMP}}.

Step 1: Platform performance analysis
- Assess ROAS and engagement rates for each active social platform (e.g. Facebook, Instagram, TikTok, Pinterest, YouTube)
- Break down performance by campaign objective, audience targeting, and spend level
- Identify which content types (video, carousel, static image, story/reel formats) drive the highest engagement and conversions

Step 2: UTM and creative impact review
- Analyse UTM-tagged campaign data to trace conversions back to specific creative assets and ad variations
- Highlight top-performing creative based on conversion rate, ROAS, and cost per acquisition
- Identify creative formats or messages that consistently underperform

Step 3: Cross-channel remarketing opportunities
- Audit current remarketing activity across platforms
- Identify gaps such as missing audience retargeting windows, underused high-intent segments (cart abandoners, high-value visitors), or untested creative approaches
- Recommend cross-channel sequencing strategies to improve conversion lift

Step 4: Output format
1. Table showing ROAS, engagement rate, and top content types by platform
2. Creative performance summary linked to conversion data
3. List of remarketing gaps with recommended tactics and expected ROI impact$body$,
 'Acquisition',
 ARRAY['monthly-reporting', 'internal-strategy', 'opportunity-discovery'],
 ARRAY['Shopify Analytics', 'Facebook Ads', 'Google Ads'],
 'intermediate',
 'internal',
 'published',
 'During social media performance reviews or when optimising paid social creative and remarketing strategy.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$store-technical-issue-diagnosis$slug$,
 'Store Technical Issue Diagnosis',
 'Runs a complete Shopify technical health audit to detect site speed issues, code bottlenecks, and performance risks.',
 $body$Act as my Shopify technical performance auditor. Identify any technical issues or performance bottlenecks affecting my store and provide recommended fixes.

Step 1: Site performance review
- Evaluate page load speed (desktop and mobile) using Shopify's latest performance metrics
- Identify large media files, unoptimised images, or unnecessary scripts slowing the store
- Flag theme or app-related slowdowns

Step 2: Technical issue audit
- Check for broken links, 404 errors, or redirect loops
- Test mobile responsiveness and cross-browser compatibility
- Verify correct implementation of structured data (SEO schema)
- Identify any issues with JavaScript, CSS, or third-party integrations that affect performance

Step 3: Bottleneck analysis
- Assess checkout load times and responsiveness
- Review inventory syncing and API calls for delays
- Flag any apps or integrations causing excessive server requests or downtime risk

Step 4: Output format
1. Table of identified issues (impact level, cause, recommended fix)
2. Prioritised list of actions with estimated effort and performance improvement$body$,
 'Tech',
 ARRAY['qa-validation', 'onboarding', 'issue-investigation'],
 ARRAY['Shopify Admin', 'Google PageSpeed', 'Shopify Analytics'],
 'intermediate',
 'internal',
 'published',
 'When a store is experiencing unexplained performance drops, slow page loads, or before a major theme or platform update.',
 NULL,
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$subscription-conversion-potential-analysis$slug$,
 'Subscription Conversion Potential Analysis',
 'Analyses if returning buyers would convert to subscription-only offers, including rates, order patterns, and recommendation.',
 $body$Act as an expert data analyst for my Shopify store. Evaluate the subscription conversion potential among returning customers over {{TF}}, compared to {{CMP}}, with the goal of determining whether we should create a subscription-only landing page.

Step 1: Subscription conversion analysis
Calculate the percentage of first-time purchasers who subscribe:
- On their second visit
- On any return visit

Include average time from first order to subscription.

Step 2: Subscription quantity insights
- Identify the most popular subscription sizes and the percentage distribution for each
- Compare average one-time purchase quantity vs average subscription quantity

Step 3: Conversion pathway patterns
Determine:
- Average number of orders before subscribing
- Average total units purchased before subscribing
- Days between first order and subscription
- Purchase frequency patterns that signal subscription readiness

Step 4: Subscription success metrics
Calculate:
- Subscription retention rate
- Average subscriber LTV vs average one-time buyer LTV
- Churn risk by subscription quantity

Step 5: Decision criteria
- If subscription conversion rate is above 15%, recommend YES to the subscription-only landing page
- If below 5%, recommend NO

Final output:
1. First-time-to-subscriber conversion %
2. Top 3 optimal subscription quantities
3. Yes/No recommendation for subscription-only landing page
4. Supporting key metrics$body$,
 'Subscriptions',
 ARRAY['opportunity-discovery', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Subscriptions'],
 'advanced',
 'internal',
 'published',
 'When evaluating whether to invest in a subscription model or subscription-specific landing page for repeat-purchase products.',
 'Requires Shopify Subscriptions or a subscription app to be active on the store.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$summer-sale-campaign-creator$slug$,
 'Summer Sale Campaign Creator',
 'Designs a high-impact sale campaign focused on top-selling products with sufficient inventory, urgency messaging, and channel recommendations.',
 $body$You are my expert Marketing Manager. Create a high-impact Summer Sale campaign to promote [Collection Name], focusing on the value of the products, the urgency of the limited-time offer, and compelling messaging that resonates with potential buyers.

First, identify top-selling items in [Collection Name] with sufficient inventory to support the campaign. Prioritise these products in the marketing materials.

Ensure the campaign strategy balances value messaging with attractive pricing, and include recommendations for:
- Visuals and creative direction
- Copy and messaging hierarchy
- Promotional channels (email, social, paid, on-site banners)
- Urgency and scarcity mechanics

Aim to drive maximum conversions while protecting margin on hero products.

Deliverables:
1. Campaign concept and messaging framework
2. Top product priority list with inventory rationale
3. Channel recommendations with suggested tactics
4. Example copy for email subject line, hero headline, and CTA$body$,
 'Strategy',
 ARRAY['pre-launch', 'internal-strategy'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'beginner',
 'internal',
 'published',
 'When planning a seasonal sale campaign and needing to develop the messaging framework, channel strategy, and product priority list quickly.',
 'Replace [Collection Name] with your actual collection or product range before using.',
 'Shopify',
 FALSE, FALSE, 1, NOW()),

($slug$ultimate-bfcm-performance-and-readiness$slug$,
 'Ultimate BFCM Performance and Readiness Analysis',
 'Comprehensive BFCM performance review and readiness check: compares last year''s BFCM against baseline and YoY, identifies top performers, and prioritises this year''s strategy.',
 $body$Act as my expert Shopify ecommerce analyst. Perform a comprehensive Black Friday–Cyber Monday (BFCM) performance review and readiness check using my Shopify data.

Step 1: Performance comparison
Compare {{TF}} against:
- The same year's regular monthly average (baseline performance)
- {{CMP}}

Metrics to include:
- Total Sales, Orders, and Units Sold
- Average Order Value (AOV)
- Conversion Rate (CVR)
- Sessions and Traffic Sources (Organic, Paid, Email, Social, Referral, etc.)
- Customer Acquisition Cost (CAC) and Return on Ad Spend (ROAS)
- New vs Returning Customer mix
- RFM segment performance during BFCM vs baseline
- Cart abandonment rate and checkout completion rate

Step 2: Best performers and revenue drivers
Identify:
- Top 10 products and bundles by revenue and units sold
- Highest-converting traffic sources and campaigns
- Promotional offers with the strongest lift (discount %, free shipping, bundles, gifts with purchase)
- Best-performing landing pages and collections
- High-value customer segments acquired during BFCM

Step 3: Readiness check for this year
Compare current readiness to last year's pre-BFCM state:
- Inventory levels for top sellers and forecasted demand gaps
- Site performance (page speed, mobile responsiveness, uptime)
- Fulfilment capacity (handling peak order volume)
- Email/SMS subscriber list growth and engagement health
- Paid media budgets and targeting readiness in Shopify Audiences (US merchants)

Step 4: Strategic recommendations
- List 3–5 priority actions to maximise sales this BFCM based on learnings from last year
- Highlight quick wins vs long-term improvements
- Suggest testing opportunities (offers, channels, creative) to improve results

Output format:
1. Side-by-side comparison tables (BFCM vs baseline vs YoY)
2. Charts for traffic, AOV, and CVR trends
3. Top performer tables for products, campaigns, and traffic sources
4. Bullet-point recommendations with projected impact$body$,
 'BFCM',
 ARRAY['pre-launch', 'trading-review', 'internal-strategy', 'client-presentation'],
 ARRAY['Shopify Analytics', 'Shopify Reports'],
 'advanced',
 'internal',
 'published',
 'The most comprehensive BFCM prompt. Use in the weeks before BFCM for strategic planning, or in the weeks after for a full debrief.',
 NULL,
 'Shopify',
 TRUE, TRUE, 1, NOW());

-- ────────────────────────────────────────────────────────────────
-- SAMPLE COLLECTIONS
-- ────────────────────────────────────────────────────────────────

INSERT INTO prompt_collections (slug, title, description, visibility, is_featured)
VALUES
  ('post-launch-review', 'Post-Launch Review Pack', 'Essential prompts for reviewing store performance after a launch, redesign, or major update.', 'internal', TRUE),
  ('monthly-reporting', 'Monthly Reporting Pack', 'A structured set of prompts for building a comprehensive monthly performance report.', 'internal', TRUE),
  ('bfcm-preparation', 'BFCM Preparation Pack', 'Everything you need to plan, execute, and debrief a Black Friday–Cyber Monday campaign.', 'internal', TRUE),
  ('cro-audit', 'CRO Audit Starter Pack', 'Core prompts for conducting a conversion rate optimisation audit from top to bottom of the funnel.', 'internal', FALSE),
  ('ltv-and-retention', 'LTV & Retention Pack', 'Prompts focused on understanding and growing customer lifetime value and repeat purchase behaviour.', 'internal', FALSE);

-- ────────────────────────────────────────────────────────────────
-- COLLECTION ITEMS — Post-Launch Review Pack
-- ────────────────────────────────────────────────────────────────

INSERT INTO prompt_collection_items (collection_id, prompt_id, sort_order)
SELECT
  (SELECT id FROM prompt_collections WHERE slug = 'post-launch-review'),
  p.id,
  t.sort_order
FROM (VALUES
  ('executive-performance-summary',        1),
  ('funnel-and-checkout-performance',      2),
  ('product-and-merchandising-performance',3),
  ('device-and-channel-efficiency',        4),
  ('homepage-and-entry-page-performance',  5)
) AS t(slug, sort_order)
JOIN prompts p ON p.slug = t.slug;

-- ────────────────────────────────────────────────────────────────
-- COLLECTION ITEMS — BFCM Preparation Pack
-- ────────────────────────────────────────────────────────────────

INSERT INTO prompt_collection_items (collection_id, prompt_id, sort_order)
SELECT
  (SELECT id FROM prompt_collections WHERE slug = 'bfcm-preparation'),
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.source_label DESC, p.created_at)
FROM prompts p
WHERE p.category = 'BFCM'
  AND p.status = 'published';
