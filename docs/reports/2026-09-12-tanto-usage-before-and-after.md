# tanto's usage, one day before and one day with it

The human's Claude Code usage for two days, read from the VS Code extension
"Claude Code Usage" and pasted into Kanri's window on 2026-09-12: 2026-09-02,
before the tanto skill existed, and 2026-09-11, the day the kisou-refresh plan
ran its batches and fix wave, a second topic's spec stage, five bug reports,
and two rate limits. The numbers are the extension's; the prices are the
Claude API documentation's as read the same day; the reading is Kanri's. What
this record cannot settle is the model mix behind each line, which the
extension does not break out, so every share below is a share of tokens, not
of dollars.

## The two days

| | 2026-09-02 | 2026-09-11 | ratio |
| --- | --- | --- | --- |
| Cost | $499.14 | $1155.89 | 2.3× |
| Input tokens (uncached) | 6,596 | 31,104 | 4.7× |
| Output tokens | 2,490,986 | 5,319,514 | 2.1× |
| Input cache miss | 13,207,649 | 65,755,995 | 5.0× |
| Input cache hit | 467,808,595 | 944,337,959 | 2.0× |
| Cache hit rate | 97% | 93% | |
| Messages | 153 | 169 | 1.1× |

Hourly, 2026-09-02 (cost, uncached input, output, cache miss, cache hit, hit
rate, messages):

| Hour | Cost | Input | Output | Miss | Hit | Rate | Msgs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 09 | $0.70 | 4 | 3,869 | 21,509 | 73,478 | 77% | 1 |
| 10 | $24.02 | 28 | 15,905 | 1,061,902 | 1,990,876 | 65% | 5 |
| 11 | $52.68 | 360 | 271,218 | 1,476,866 | 24,751,663 | 94% | 17 |
| 12 | $0.35 | 2 | 1,473 | 678 | 257,978 | 100% | 0 |
| 13 | $41.50 | 198 | 106,199 | 954,597 | 22,578,449 | 96% | 16 |
| 14 | $157.09 | 1,192 | 391,153 | 1,408,978 | 146,460,788 | 99% | 25 |
| 15 | $45.64 | 1,534 | 396,474 | 1,440,081 | 47,276,802 | 97% | 24 |
| 16 | $37.51 | 1,092 | 368,385 | 1,502,313 | 51,813,489 | 97% | 22 |
| 17 | $0.00 | 0 | 0 | 0 | 0 | – | 1 |
| 19 | $43.38 | 580 | 273,790 | 1,785,442 | 44,694,880 | 96% | 13 |
| 20 | $33.47 | 496 | 212,004 | 1,476,595 | 38,258,234 | 96% | 11 |
| 21 | $19.66 | 398 | 160,662 | 685,483 | 30,033,687 | 98% | 5 |
| 22 | $22.94 | 456 | 146,472 | 645,728 | 41,689,346 | 98% | 7 |
| 23 | $20.20 | 256 | 143,382 | 747,477 | 17,928,925 | 96% | 6 |

Hourly, 2026-09-11:

| Hour | Cost | Input | Output | Miss | Hit | Rate | Msgs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 04 | $54.19 | 2,030 | 137,714 | 3,322,020 | 34,202,442 | 91% | 17 |
| 05 | $93.95 | 2,998 | 433,919 | 5,278,689 | 51,521,333 | 91% | 35 |
| 06 | $110.54 | 3,834 | 584,842 | 6,232,546 | 80,651,086 | 93% | 17 |
| 07 | $105.04 | 1,518 | 877,933 | 4,206,289 | 101,949,162 | 96% | 12 |
| 09 | $117.22 | 2,198 | 259,022 | 5,910,419 | 85,167,024 | 94% | 9 |
| 10 | $29.59 | 728 | 61,124 | 1,981,401 | 20,044,654 | 91% | 1 |
| 11 | $98.18 | 2,986 | 613,827 | 5,847,375 | 103,601,045 | 95% | 17 |
| 12 | $151.49 | 3,492 | 540,075 | 9,438,682 | 107,228,839 | 92% | 19 |
| 13 | $180.29 | 6,264 | 769,173 | 10,372,867 | 153,875,335 | 94% | 29 |
| 14 | $136.63 | 3,946 | 766,345 | 7,610,356 | 144,448,426 | 95% | 11 |
| 15 | $66.32 | 1,022 | 232,191 | 4,631,790 | 53,975,570 | 92% | 2 |
| 16 | $12.45 | 88 | 43,349 | 923,561 | 7,673,043 | 89% | 0 |

## The prices the reading uses

Per million tokens, from the Claude API models and pricing pages as read on
2026-09-12. The cache-write column is the 1-hour TTL price, which is the TTL
this harness states its requests use; the 5-minute write is 1.25× input.

| Model | Input | Output | Cache write (1h) | Cache read | Window |
| --- | --- | --- | --- | --- | --- |
| Fable 5.1 | $10 | $50 | $20 | $0.25 | 1M |
| Opus 5 | $5 | $25 | $10 | $0.50 | 1M |
| Sonnet 5 | $2 | $10 | $4 | $0.20 | 1M |
| Haiku 4.5 | $1 | $5 | $2 | $0.10 | 200K |

So under the 1-hour TTL a cache miss costs 80 times a cache hit per token on
Fable and 20 times on Sonnet, and a Sonnet miss costs one fifth of a Fable
miss.

## The reading

- Misses grew 5× while hits grew 2× and output 2.1×. Weighted by price, the
  misses' share of the day's input cost rose from roughly a quarter to half
  or more, and output stays a little over a tenth. The lever is in the
  misses, not in output — so effort and thinking settings act on the smaller
  term.
- The likely miss sources, in the order Kanri weights them: a wait longer
  than the cache TTL, which a resident session that waits for a batch (Kanri,
  Jisso) meets every batch longer than an hour, after which its next wake-up
  rewrites its whole context; every subagent's cold start, and 2026-09-11 ran
  dozens (implementers, reviewers, five translators, brief writers, a
  drafter); and, unmeasured, a change of the tool list mid-session, which
  invalidates the prefix cache. The human's own hypothesis — that under tanto
  the human no longer prompts continuously, so caches expire — is the first
  of these.
- No session in any tanto run has compacted (every Residency row in the
  roster archive reads 0), so the context window is not the binding
  constraint; the per-wake-up write is. What decides the cost is which family
  holds the long context that waits: a Fable Kanri pays the highest write
  price for a context it uses mostly clerically, which is the human's
  conclusion of the same day — "Fable Kanri は無理".
- The 2026-09-11 readings behind the day (from the roster archive and the
  kisou-refresh dogfood report): Kanri 5.5 MB and 56 wake-ups at the final
  batch, the opus plan Sekkei 3.3 MB and 23, the fable spec Sekkei 1.9 MB and
  28, Jisso 3.5 MB and 21 at the fix wave.

## What follows from it

The role matrix the human proposed on 2026-09-12 and Kanri's assessment of it
— resident sessions on the cheaper families, the top family bought in
short-lived subagents, effort as the one dial since thinking has no
per-subagent setting — are the cost topic's first spec input, held in that
topic's directory until its spec cites this report. The first measurement of
the matrix is the tanto-workspace plan's batches under a Sonnet Kanri,
decided the same day (tanto-workspace ledger R-10).
