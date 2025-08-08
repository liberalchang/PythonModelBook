source "https://rubygems.org"

# GitHub Pages兼容配置
gem "github-pages", group: :jekyll_plugins

# Jekyll插件（GitHub Pages已包含这些插件）
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
end

# Windows和JRuby平台支持
platforms :windows do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Windows性能优化（可选）
# gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# JRuby支持
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# 开发依赖
gem "webrick", "~> 1.7"